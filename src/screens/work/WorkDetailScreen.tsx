import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import {AddSquare, Camera, DocumentUpload, Edit2} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Octicons from 'react-native-vector-icons/Octicons';
import {HandleCommentAPI} from '../../apis/handleCommentAPI';
import {HandleCustomerAPI} from '../../apis/handleCustomerAPI';
import {HandleMaintanceScheduleAPI} from '../../apis/handleMaintanceScheduleAPI';
import {HandleUserAPI} from '../../apis/handleUserAPI';
import {HandleWorkSessionAPI} from '../../apis/handleWorkSessionAPI';
import {
  ContainerComponent,
  DropDownPickerStatusComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import ButtonComponent from '../../components/ButtonComponent';
import {appColors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {EditWorkSessionModal, ModalSelectedFile} from '../../modals';
import {SelectStatusModel} from '../../models/SelectStatusModel';
import {UserModel} from '../../models/UserModel';
import {globalStyles} from '../../styles/globalStyle';
import {DateTime} from '../../utils/DateTime';
import {formatCurrencyVND} from '../../utils/moneyFormatCurrency';

const initialStatusWorks = [
  {
    id: 'accepted',
    value: 'accepted',
  },
  {
    id: 'pending',
    value: 'pending',
  },
  {
    id: 'rejected',
    value: 'rejected',
  },
  {
    id: 'completed',
    value: 'completed',
  },
];

const initialUpdateWorkSession = {
  status: '',
  rejection_reason: '', // Có thể là null nếu không có lý do từ chối
  before_images: [], // Danh sách các URL hình ảnh trước khi làm
  after_images: [], // Danh sách các URL hình ảnh sau khi làm
  before_image_firebase: [], // Danh sách các URL hình ảnh trước khi làm
  after_image_firebase: [], // Danh sách các URL hình ảnh sau khi làm
  result: '', // Có thể là null nếu không có kết quả
};

const initialErrors = {
  rejection_reason: '',
  before_images: '',
  after_images: '',
  result: '',
};

const WorkDetailScreen = ({navigation, route}: any) => {
  const {id} = route.params;
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [workSessionById, setworkSessionById] = useState<any>();
  const [staffById, setStaffById] = useState<any>();
  const [customerById, setcustomerById] = useState<any>();
  const [commentById, setCommentById] = useState<any>();
  const [existingMaintanceSchedule, setExistingMaintanceSchedule] =
    useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const [workFormUpdate, setWorkFormUpdate] = useState<any>(
    initialUpdateWorkSession,
  );

  const [visibleChoiceFileBefore, setVisibleChoiceFileBefore] = useState(false);
  const [visibleChoiceFileAfter, setVisibleChoiceFileAfter] = useState(false);
  const [comment, setComment] = useState('');
  const [statusSelect, setStatusSelect] = useState<SelectStatusModel[]>([]);
  const [isVisibleEditModal, setIsVisibleEditModal] = useState(false);

  useEffect(() => {
    fetchUserData();
    handleGetAllStatus();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchDetailTask(id);
    }
  }, [userData]);

  useEffect(() => {
    if (workSessionById) {
      fetchDetailStaff(workSessionById.employee_id);
      fetchDetailCustomer(workSessionById.customer_id);
      fetchComment(workSessionById.comments);
      fetchCheckMaintanceSchedule(
        workSessionById.employee_id,
        workSessionById.customer_id,
      );
      // handleGetAllStatus();
    }
  }, [workSessionById]);

  const fetchUserData = async () => {
    setIsLoading(true);
    const user = await AsyncStorage.getItem('auth');
    if (user) {
      const parsedUser = JSON.parse(user);
      const api = `/info?id=${parsedUser.id}`;
      try {
        const userWithId = await HandleUserAPI.Info(api);
        if (userWithId) {
          setUserData(userWithId.data);
        } else {
          console.log('Không có thông tin liên quan!');
        }
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchDetailTask = async (id: string) => {
    setIsLoading(true);
    const api = `/workSessionById?id=${id}`;
    try {
      const workWithId = await HandleWorkSessionAPI.WorkSession(api);
      setworkSessionById(workWithId.data);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDetailStaff = async (id: string) => {
    setIsLoading(true);
    const api = `/info?id=${id}`;
    try {
      const staffWithId = await HandleUserAPI.Info(api);
      setStaffById(staffWithId.data);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDetailCustomer = async (id: string) => {
    setIsLoading(true);
    const api = `/detailCustomer?id=${id}`;
    try {
      const customerWithId = await HandleCustomerAPI.Customer(api);
      setcustomerById(customerWithId.data);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComment = async (id: string) => {
    setIsLoading(true);
    const api = `/getComment?id=${id}`;
    try {
      const commentWithId = await HandleCommentAPI.Comment(api);
      setCommentById(commentWithId.data);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCheckMaintanceSchedule = async (
    employee_id: string,
    customer_id: string,
  ) => {
    // console.log(employee_id, customer_id);
    const api = '/checkMaintanceSchedule';
    try {
      const checkExistingSchedule =
        await HandleMaintanceScheduleAPI.MaintanceSchedule(
          api,
          {
            employee_id: employee_id,
            customer_id: customer_id,
            work_session_id: id,
          },
          'post',
        );
      setExistingMaintanceSchedule(checkExistingSchedule.data);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAllStatus = async () => {
    const items: SelectStatusModel[] = initialStatusWorks.map(item => ({
      value: item.value,
    }));
    setStatusSelect(items);
  };

  const makeCall = (phoneNumber: string) => {
    if (!phoneNumber) {
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Người dùng chưa có số điện thoại',
        visibilityTime: 10000,
      });
      return;
    }
    const url = `tel:${phoneNumber}`;

    Linking.openURL(url);
  };

  const handleDeleteWork = async (id: string) => {
    const api = `/softDeleteWorkSessionById?id=${id}`;
    await HandleWorkSessionAPI.WorkSession(api, undefined, 'delete');
    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: 'Xoá công việc thành công!!!',
      visibilityTime: 1000,
    });
    navigation.goBack(); // Nếu sử dụng react-navigation
  };

  const handleChangeValue = (
    key: string,
    value: string | number | string[],
  ) => {
    const data: any = {...workFormUpdate};
    data[`${key}`] = value;

    setWorkFormUpdate(data);
    // handleValidateInput(key, value);
  };

  const handleSelectedFile = (file: any, type: 'before' | 'after') => {
    setWorkFormUpdate((prevState: any) => ({
      ...prevState,
      [`${type}_images`]: [...prevState[`${type}_images`], file.uri],
    }));
  };

  const handleDeletedImageFile = (type: 'before' | 'after', index: number) => {
    setWorkFormUpdate((prevState: any) => {
      const updatedImages = [...prevState[`${type}_images`]];
      updatedImages.splice(index, 1); // Xoá ảnh tại vị trí index

      return {
        ...prevState,
        [`${type}_images`]: updatedImages,
      };
    });
  };

  const uploadImagesToFirebase = async (
    images: string[],
    type: 'before' | 'after',
  ) => {
    const uploadPromises = images.map(async (imageUri, index) => {
      const folderName = type === 'before' ? 'before_images' : 'after_images'; // Đặt tên folder
      const fileName = `${folderName}/${type}_image_${Date.now()}_${index}.jpg`; // Đặt tên file với folder
      const storageRef = storage().ref(fileName);

      const task = storageRef.putFile(imageUri);

      try {
        await task;
        const downloadURL = await storageRef.getDownloadURL();
        return downloadURL;
      } catch (error) {
        console.error('Upload image failed: ', error);
        return null;
      }
    });

    const urls = await Promise.all(uploadPromises);
    return urls.filter(url => url !== null); // Loại bỏ những URL null (nếu có lỗi)
  };

  const handleUploadBeforeImages = async () => {
    try {
      const beforeImageUrls = await uploadImagesToFirebase(
        workFormUpdate.before_images,
        'before',
      );

      // Cập nhật lại state với các URL từ Firebase
      setWorkFormUpdate((prevState: any) => ({
        ...prevState,
        before_image_firebase: beforeImageUrls,
        before_images: [],
      }));

      console.log('Upload trước thành công và state đã được cập nhật.');
    } catch (error) {
      console.error('Lỗi khi upload hình ảnh trước: ', error);
    }
  };

  const handleUploadAfterImages = async () => {
    try {
      const afterImageUrls = await uploadImagesToFirebase(
        workFormUpdate.after_images,
        'after',
      );

      // Cập nhật lại state với các URL từ Firebase
      setWorkFormUpdate((prevState: any) => ({
        ...prevState,
        after_image_firebase: afterImageUrls,
        after_images: [],
      }));

      console.log('Upload sau thành công và state đã được cập nhật.');
    } catch (error) {
      console.error('Lỗi khi upload hình ảnh sau: ', error);
    }
  };

  const handleUpdateWork = async () => {
    // console.log(workFormUpdate.status);
    // console.log(workFormUpdate.rejection_reason);
    // console.log(workFormUpdate.before_images);
    // console.log(workFormUpdate.after_images);
    // console.log(workFormUpdate.result);
    const api = `/updatedWorkSessionById?id=${id}`;
    // console.log(api);
    setIsLoading(true);
    try {
      await HandleWorkSessionAPI.WorkSession(
        api,
        {
          status: workFormUpdate.status,
          rejection_reason: workFormUpdate.rejection_reason,
          before_images: workFormUpdate.before_image_firebase,
          after_images: workFormUpdate.after_image_firebase,
          result: workFormUpdate.result,
        },
        'put',
      );

      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Cập nhật thành công!!!',
        visibilityTime: 1000,
      });

      navigation.goBack();
    } catch (error: any) {
      console.error('Lỗi cập nhật công việc: ', error);
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: error.message,
        visibilityTime: 1000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    // console.log(comment);
    const api = `/createComment`;
    try {
      await HandleCommentAPI.Comment(
        api,
        {
          comment: comment,
          customer_id: workSessionById.customer_id,
          employee_id: workSessionById.employee_id,
          work_session_id: id,
        },
        'post',
      );
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Nhận xét khách hàng thành công',
        visibilityTime: 1000,
      });
      setComment('');
    } catch (error: any) {
      console.log(error.message);
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: error.message,
        visibilityTime: 1000,
      });
    }
  };
  // console.log(workSessionById);
  // console.log(staffById);
  // console.log(customerById);
  // console.log(existingMaintanceSchedule[0].scheduled_date);
  // console.log(commentById);
  // console.log(commentById[0]?.comment);
  // console.log(workFormUpdate.status);
  // console.log(workFormUpdate);
  // Hàm render giao diện cho admin
  const renderAdminView = () => {
    return (
      <>
        <SpaceComponent height={15} />
        <TextComponent
          text="I. Mô tả công việc"
          size={18}
          font={fontFamilies.bold}
        />
        <SpaceComponent height={15} />
        <RowComponent styles={{alignItems: 'flex-start'}}>
          <FontAwesome6
            name="screwdriver-wrench"
            size={25}
            color={appColors.text}
          />
          <SpaceComponent width={10} />
          <TextComponent
            text={workSessionById.description}
            size={16}
            font={fontFamilies.bold}
            flex={1}
          />
        </RowComponent>
        <SpaceComponent height={15} />
        <RowComponent>
          <TextComponent
            text="Trạng thái: "
            size={16}
            font={fontFamilies.bold}
          />
          <TextComponent
            size={16}
            text={`${
              workSessionById.status === 'assigned'
                ? 'Đã giao việc'
                : workSessionById.status === 'accepted'
                ? 'Nhận công việc'
                : workSessionById.status === 'pending'
                ? 'Xử lý công việc'
                : workSessionById.status === 'rejected'
                ? 'Từ chối công việc'
                : workSessionById.status === 'completed'
                ? 'Đã hoàn thành công việc'
                : 'Có lỗi xảy ra'
            }`}
            color={appColors.white}
            font={fontFamilies.bold}
            styles={{
              backgroundColor: `${
                workSessionById.status === 'assigned'
                  ? appColors.primary
                  : workSessionById.status === 'accepted'
                  ? appColors.warning
                  : workSessionById.status === 'pending'
                  ? appColors.edit
                  : workSessionById.status === 'rejected'
                  ? appColors.danager
                  : workSessionById.status === 'completed'
                  ? appColors.success
                  : appColors.red
              }`,
              paddingHorizontal: 10,
              paddingVertical: 5,
              color: appColors.white,
              borderRadius: 5,
            }}
          />
        </RowComponent>
        <SpaceComponent height={15} />
        <RowComponent>
          <TextComponent text="Số tiền dự án: " size={16} />
          <TextComponent
            text={`${formatCurrencyVND(workSessionById.amount)}`}
            size={16}
            styles={{
              backgroundColor: appColors.success,
              paddingHorizontal: 8,
              paddingVertical: 5,
              color: appColors.white,
              borderRadius: 5,
            }}
            font={fontFamilies.bold}
          />
        </RowComponent>
        <SpaceComponent height={15} />
        <RowComponent>
          <TextComponent text="Số tiền nhân viên nhận: " size={16} />
          <TextComponent
            text={`${formatCurrencyVND(workSessionById.payment_amount)}`}
            size={16}
            styles={{
              backgroundColor: appColors.danager,
              paddingHorizontal: 8,
              paddingVertical: 5,
              color: appColors.white,
              borderRadius: 5,
            }}
            font={fontFamilies.bold}
          />
        </RowComponent>
        <SpaceComponent height={15} />
        <RowComponent>
          <TextComponent text="Lợi nhuận: " size={16} />
          <TextComponent
            text={`${formatCurrencyVND(
              workSessionById.amount - workSessionById.payment_amount,
            )}`}
            size={16}
            styles={{
              backgroundColor: appColors.success,
              paddingHorizontal: 8,
              paddingVertical: 5,
              color: appColors.white,
              borderRadius: 5,
            }}
            font={fontFamilies.bold}
          />
        </RowComponent>
        <SpaceComponent height={15} />
        <RowComponent>
          <TextComponent text="Tên nhân viên: " size={16} />
          <TextComponent text={staffById?.name} size={16} />
        </RowComponent>
        <SpaceComponent height={15} />
        <RowComponent>
          <TextComponent text="Số điện thoại:  " size={16} />
          <ButtonComponent
            text={staffById?.phone}
            type="link"
            textAndLinkStyle={{fontSize: 16}}
            onPress={() => makeCall(staffById?.phone)}
          />
        </RowComponent>
        <SpaceComponent height={15} />
        <RowComponent>
          <TextComponent text="Ngày bắt đầu: " size={16} />
          <TextComponent
            text={`${DateTime.dateToDateString(workSessionById.start_time)}`}
            size={16}
          />
        </RowComponent>
        <SpaceComponent height={15} />
        <RowComponent>
          <TextComponent text="Dự kiến kết thúc: " size={16} />
          <TextComponent
            text={`${DateTime.dateToDateString(workSessionById.end_time)}`}
            size={16}
          />
        </RowComponent>

        <SpaceComponent height={15} />
        <RowComponent>
          <TextComponent text="Tên khách hàng: " size={16} />
          <TextComponent text={customerById?.name} size={16} />
        </RowComponent>
        <SpaceComponent height={15} />
        <RowComponent>
          <TextComponent text="Số điện thoại:  " size={16} />
          <ButtonComponent
            text={customerById?.phone}
            type="link"
            textAndLinkStyle={{fontSize: 16}}
            onPress={() => makeCall(customerById?.phone)}
          />
        </RowComponent>
        <SpaceComponent height={15} />
        <TextComponent
          text="II. Phản hồi từ thợ"
          size={18}
          font={fontFamilies.bold}
        />
        <SpaceComponent height={15} />

        {/* <RowComponent>
          <TextComponent text="Lịch bảo trì: " size={16} />
          {workSessionById.maintenance_schedule &&
          existingMaintanceSchedule &&
          existingMaintanceSchedule[0]?.scheduled_date ? (
            <>
              <TextComponent
                text={`${DateTime.dateToDateString(
                  existingMaintanceSchedule[0].scheduled_date,
                )}`}
                size={16}
              />
            </>
          ) : (
            <>
              <TextComponent text="Hiện chưa có lịch bảo trì" size={16} />
            </>
          )}
        </RowComponent>
        <SpaceComponent height={15} /> */}

        {workSessionById.rejection_reason ? (
          <>
            {/* Nếu có lý do từ chối thì chỉ hiện lý do từ chối */}
            <TextComponent text="Lý do từ chối" size={16} />
            <SpaceComponent height={10} />
            <TextComponent text={workSessionById.rejection_reason} size={16} />
            <SpaceComponent height={15} />
          </>
        ) : (
          <>
            {/* Nếu không có lý do từ chối thì hiện các phần khác */}
            <RowComponent>
              <TextComponent text="Lịch bảo trì: " size={16} />
              {workSessionById.maintenance_schedule &&
              existingMaintanceSchedule &&
              existingMaintanceSchedule[0]?.scheduled_date ? (
                <>
                  <TextComponent
                    text={`${DateTime.dateToDateString(
                      existingMaintanceSchedule[0].scheduled_date,
                    )}`}
                    size={16}
                  />
                </>
              ) : (
                <>
                  <TextComponent text="Hiện chưa có lịch bảo trì" size={16} />
                </>
              )}
            </RowComponent>
            <SpaceComponent height={15} />
            {workSessionById.before_images.length > 0 ? (
              <>
                <TextComponent text="Ảnh trước khi sửa" size={16} />
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  <RowComponent styles={{paddingVertical: 10}}>
                    {Array.isArray(workSessionById.before_images) &&
                      workSessionById.before_images.map(
                        (image: any, index: any) => (
                          <View
                            key={index}
                            style={{position: 'relative', marginRight: 20}}>
                            <Image
                              source={{uri: image}}
                              style={{
                                width: 100,
                                height: 150,
                                borderRadius: 10,
                              }}
                            />
                          </View>
                        ),
                      )}
                  </RowComponent>
                </ScrollView>
                <SpaceComponent height={15} />
              </>
            ) : (
              <>
                <TextComponent
                  text="Hiện chưa có ảnh trước khi sửa"
                  size={16}
                />
                <SpaceComponent height={15} />
              </>
            )}

            {workSessionById.after_images.length > 0 ? (
              <>
                <TextComponent text="Ảnh sau khi sửa" size={16} />
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  <RowComponent styles={{paddingVertical: 10}}>
                    {Array.isArray(workSessionById.after_images) &&
                      workSessionById.after_images.map(
                        (image: any, index: any) => (
                          <View
                            key={index}
                            style={{position: 'relative', marginRight: 20}}>
                            <Image
                              source={{uri: image}}
                              style={{
                                width: 100,
                                height: 150,
                                borderRadius: 10,
                              }}
                            />
                          </View>
                        ),
                      )}
                  </RowComponent>
                </ScrollView>
                <SpaceComponent height={15} />
              </>
            ) : (
              <>
                <TextComponent text="Hiện chưa có ảnh sau khi sửa" size={16} />
                <SpaceComponent height={15} />
              </>
            )}

            {workSessionById.result ? (
              <>
                <TextComponent text="Kết qủa công việc" size={16} />
                <TextComponent text={workSessionById.result} size={16} />
                <SpaceComponent height={15} />
              </>
            ) : (
              <>
                <TextComponent
                  text="Hiện chưa có kết quả công việc"
                  size={16}
                />
                <SpaceComponent height={15} />
              </>
            )}

            {workSessionById.comments &&
            commentById &&
            commentById[0]?.comment ? (
              <>
                <TextComponent text="Bình luận" size={16} />
                <TextComponent text={commentById[0]?.comment} size={16} />
                <SpaceComponent height={15} />
              </>
            ) : (
              <>
                <TextComponent text="Hiện chưa có bình luận" size={16} />
                <SpaceComponent height={15} />
              </>
            )}
          </>
        )}

        <ButtonComponent
          text="Xoá công việc"
          onPress={() => handleDeleteWork(id)}
          type="primary"
          color={appColors.red}
        />
      </>
    );
  };

  // Hàm render giao diện cho employee
  const renderEmployeeView = () => {
    return (
      <>
        <TextComponent
          text="I. Mô tả công việc"
          size={18}
          font={fontFamilies.bold}
        />
        <SpaceComponent height={15} />
        <RowComponent styles={{alignItems: 'flex-start'}}>
          <FontAwesome6
            name="screwdriver-wrench"
            size={25}
            color={appColors.text}
          />
          <SpaceComponent width={10} />
          <TextComponent
            text={workSessionById.description}
            size={16}
            font={fontFamilies.bold}
            flex={1}
          />
        </RowComponent>
        <SpaceComponent height={15} />
        <RowComponent>
          <TextComponent
            text="Trạng thái: "
            size={16}
            font={fontFamilies.bold}
          />
          <TextComponent
            size={16}
            text={`${
              workSessionById.status === 'assigned'
                ? 'Đã giao việc'
                : workSessionById.status === 'accepted'
                ? 'Nhận công việc'
                : workSessionById.status === 'pending'
                ? 'Xử lý công việc'
                : workSessionById.status === 'rejected'
                ? 'Từ chối công việc'
                : workSessionById.status === 'completed'
                ? 'Đã hoàn thành công việc'
                : 'Có lỗi xảy ra'
            }`}
            color={appColors.white}
            font={fontFamilies.bold}
            styles={{
              backgroundColor: `${
                workSessionById.status === 'assigned'
                  ? appColors.primary
                  : workSessionById.status === 'accepted'
                  ? appColors.warning
                  : workSessionById.status === 'pending'
                  ? appColors.edit
                  : workSessionById.status === 'rejected'
                  ? appColors.danager
                  : workSessionById.status === 'completed'
                  ? appColors.success
                  : appColors.red
              }`,
              paddingHorizontal: 10,
              paddingVertical: 5,
              color: appColors.white,
              borderRadius: 5,
            }}
          />
        </RowComponent>
        <SpaceComponent height={15} />
        <RowComponent>
          <TextComponent text="Số tiền bạn sẽ được nhận: " size={16} />
          <TextComponent
            text={`${formatCurrencyVND(workSessionById.payment_amount)}`}
            size={16}
            styles={{
              backgroundColor: appColors.success,
              paddingHorizontal: 8,
              paddingVertical: 5,
              color: appColors.white,
              borderRadius: 5,
            }}
            font={fontFamilies.bold}
          />
        </RowComponent>
        <SpaceComponent height={15} />
        <RowComponent>
          <TextComponent text="Ngày bắt đầu: " size={16} />
          <TextComponent
            text={`${DateTime.dateToDateString(workSessionById.start_time)}`}
            size={16}
          />
        </RowComponent>
        <SpaceComponent height={15} />
        <RowComponent>
          <TextComponent text="Dự kiến kết thúc: " size={16} />
          <TextComponent
            text={`${DateTime.dateToDateString(workSessionById.end_time)}`}
            size={16}
          />
        </RowComponent>
        <SpaceComponent height={15} />
        <RowComponent>
          <TextComponent text="Tên khách hàng: " size={16} />
          <TextComponent text={customerById?.name} size={16} />
        </RowComponent>
        <SpaceComponent height={15} />
        <RowComponent>
          <TextComponent text="Số điện thoại:  " size={16} />
          <ButtonComponent
            text={customerById?.phone}
            type="link"
            textAndLinkStyle={{fontSize: 16}}
            onPress={() => makeCall(customerById?.phone)}
          />
        </RowComponent>
        <SpaceComponent height={15} />
        <RowComponent styles={{alignItems: 'flex-start'}}>
          <TextComponent text="Địa chỉ:  " size={16} />
          <TextComponent text={customerById?.address} size={16} flex={1} />
        </RowComponent>
        <SpaceComponent height={15} />
        {workSessionById.status === 'rejected' ? (
          <>
            <SpaceComponent height={20} />
            <TextComponent
              text="Bạn đã từ chối đơn hàng này"
              size={20}
              styles={{
                textAlign: 'center',
                backgroundColor: appColors.red,
                paddingVertical: 20,
                borderRadius: 10,
              }}
              color={appColors.white}
            />
          </>
        ) : workSessionById.status === 'completed' ? (
          <>
            <TextComponent
              text="II. Thợ cập nhật công việc"
              size={18}
              font={fontFamilies.bold}
            />

            <SpaceComponent height={15} />
            {(workFormUpdate.status === 'completed' ||
              workSessionById.status === 'completed') &&
              workFormUpdate.status !== 'rejected' && (
                <>
                  <RowComponent justify="space-between">
                    <TextComponent
                      text="Lịch bảo trì"
                      size={16}
                      font={fontFamilies.bold}
                    />
                    {existingMaintanceSchedule?.length > 0 ? (
                      <>
                        <TextComponent
                          text={`${DateTime.dateToDateString(
                            existingMaintanceSchedule[0].scheduled_date,
                          )}`}
                          size={16}
                        />
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('AddNewScheduleScreen', {
                              workSessionId: id,
                              employeeId: staffById?._id,
                              customerId: customerById?._id,
                            })
                          }>
                          <AddSquare
                            size={22}
                            color={appColors.primary}
                            variant="Bold"
                          />
                        </TouchableOpacity>
                      </>
                    )}
                  </RowComponent>
                  <SpaceComponent height={15} />

                  <RowComponent justify="space-between">
                    <TextComponent
                      text="Cập nhật hình ảnh trước khi sửa"
                      size={16}
                      font={fontFamilies.bold}
                    />

                    {workFormUpdate.before_images.length > 0 ? (
                      <>
                        <DocumentUpload
                          size={22}
                          variant="Bold"
                          color={appColors.primary}
                          onPress={handleUploadBeforeImages}
                        />
                      </>
                    ) : (
                      <></>
                    )}

                    <Camera
                      size="22"
                      color={appColors.primary}
                      variant="Bold"
                      onPress={() => {
                        setVisibleChoiceFileBefore(true);
                      }}
                    />
                  </RowComponent>
                  <SpaceComponent height={15} />
                  {workFormUpdate.before_images.length > 0 ? (
                    <>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <RowComponent styles={{paddingVertical: 10}}>
                          {Array.isArray(workFormUpdate.before_images) &&
                            workFormUpdate.before_images.map(
                              (image: any, index: any) => (
                                <View
                                  key={index}
                                  style={{
                                    position: 'relative',
                                    marginRight: 20,
                                  }}>
                                  <AntDesign
                                    name="close"
                                    size={20}
                                    color={appColors.white}
                                    style={{
                                      position: 'absolute',
                                      right: -10,
                                      top: -10,
                                      zIndex: 1,
                                      backgroundColor: appColors.red,
                                      borderRadius: 999,
                                    }}
                                    // onPress={() => removeImage(item.id, index)}
                                    onPress={() =>
                                      handleDeletedImageFile('before', index)
                                    }
                                  />
                                  <Image
                                    source={{uri: image}}
                                    style={{
                                      width: 100,
                                      height: 150,
                                      borderRadius: 10,
                                    }}
                                  />
                                </View>
                              ),
                            )}
                        </RowComponent>
                      </ScrollView>
                      <SpaceComponent height={15} />
                    </>
                  ) : (
                    <>
                      <TextComponent text="Hiện chưa có ảnh nào để tải lên hệ thống" />
                      <SpaceComponent height={15} />
                    </>
                  )}

                  {workSessionById.before_images.length > 0 ? (
                    <>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <RowComponent styles={{paddingVertical: 10}}>
                          {Array.isArray(workSessionById.before_images) &&
                            workSessionById.before_images.map(
                              (image: any, index: any) => (
                                <View
                                  key={index}
                                  style={{
                                    position: 'relative',
                                    marginRight: 20,
                                  }}>
                                  {/* <AntDesign
                                  name="close"
                                  size={20}
                                  color={appColors.white}
                                  style={{
                                    position: 'absolute',
                                    right: -10,
                                    top: -10,
                                    zIndex: 1,
                                    backgroundColor: appColors.red,
                                    borderRadius: 999,
                                  }}
                                  // onPress={() => removeImage(item.id, index)}
                                  // onPress={() => handleDeletedImageFile('before', index)}
                                /> */}
                                  <Image
                                    source={{uri: image}}
                                    style={{
                                      width: 100,
                                      height: 150,
                                      borderRadius: 10,
                                    }}
                                  />
                                </View>
                              ),
                            )}
                        </RowComponent>
                      </ScrollView>
                      <SpaceComponent height={15} />
                    </>
                  ) : (
                    <></>
                  )}

                  {/* {workFormUpdate.before_image_firebase.length > 0 ? (
                  <>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}>
                      <RowComponent styles={{paddingVertical: 10}}>
                        {Array.isArray(workFormUpdate.before_image_firebase) &&
                          workFormUpdate.before_image_firebase.map(
                            (image: any, index: any) => (
                              <View
                                key={index}
                                style={{position: 'relative', marginRight: 20}}>
                                <AntDesign
                                  name="close"
                                  size={20}
                                  color={appColors.white}
                                  style={{
                                    position: 'absolute',
                                    right: -10,
                                    top: -10,
                                    zIndex: 1,
                                    backgroundColor: appColors.red,
                                    borderRadius: 999,
                                  }}
                                  // onPress={() => removeImage(item.id, index)}
                                  // onPress={() => handleDeletedImageFile('before', index)}
                                />
                                <Image
                                  source={{uri: image}}
                                  style={{width: 100, height: 150, borderRadius: 10}}
                                />
                              </View>
                            ),
                          )}
                      </RowComponent>
                    </ScrollView>
                    <SpaceComponent height={15} />
                  </>
                ) : (
                  <></>
                )} */}

                  <RowComponent justify="space-between">
                    <TextComponent
                      text="Cập nhật hình ảnh sau khi sửa"
                      size={16}
                      font={fontFamilies.bold}
                    />

                    {workFormUpdate.after_images.length > 0 ? (
                      <>
                        <DocumentUpload
                          size={22}
                          variant="Bold"
                          color={appColors.primary}
                          onPress={handleUploadAfterImages}
                        />
                      </>
                    ) : (
                      <></>
                    )}

                    <Camera
                      size="22"
                      color={appColors.primary}
                      variant="Bold"
                      onPress={() => setVisibleChoiceFileAfter(true)}
                    />
                  </RowComponent>
                  <SpaceComponent height={15} />

                  {workFormUpdate.after_images.length > 0 ? (
                    <>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <RowComponent styles={{paddingVertical: 10}}>
                          {Array.isArray(workFormUpdate.after_images) &&
                            workFormUpdate.after_images.map(
                              (image: any, index: any) => (
                                <View
                                  key={index}
                                  style={{
                                    position: 'relative',
                                    marginRight: 20,
                                  }}>
                                  <AntDesign
                                    name="close"
                                    size={20}
                                    color={appColors.white}
                                    style={{
                                      position: 'absolute',
                                      right: -10,
                                      top: -10,
                                      zIndex: 1,
                                      backgroundColor: appColors.red,
                                      borderRadius: 999,
                                    }}
                                    // onPress={() => removeImage(item.id, index)}
                                    onPress={() =>
                                      handleDeletedImageFile('after', index)
                                    }
                                  />
                                  <Image
                                    source={{uri: image}}
                                    style={{
                                      width: 100,
                                      height: 150,
                                      borderRadius: 10,
                                    }}
                                  />
                                </View>
                              ),
                            )}
                        </RowComponent>
                      </ScrollView>
                      <SpaceComponent height={15} />
                    </>
                  ) : (
                    <>
                      <TextComponent text="Hiện chưa có ảnh nào để tải lên hệ thống" />
                      <SpaceComponent height={15} />
                    </>
                  )}

                  {/* workSessionById */}
                  {workSessionById.after_images.length > 0 ? (
                    <>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <RowComponent styles={{paddingVertical: 10}}>
                          {Array.isArray(workSessionById.after_images) &&
                            workSessionById.after_images.map(
                              (image: any, index: any) => (
                                <View
                                  key={index}
                                  style={{
                                    position: 'relative',
                                    marginRight: 20,
                                  }}>
                                  {/* <AntDesign
                                  name="close"
                                  size={20}
                                  color={appColors.white}
                                  style={{
                                    position: 'absolute',
                                    right: -10,
                                    top: -10,
                                    zIndex: 1,
                                    backgroundColor: appColors.red,
                                    borderRadius: 999,
                                  }}
                                  // onPress={() => removeImage(item.id, index)}
                                  // onPress={() => handleDeletedImageFile('before', index)}
                                /> */}
                                  <Image
                                    source={{uri: image}}
                                    style={{
                                      width: 100,
                                      height: 150,
                                      borderRadius: 10,
                                    }}
                                  />
                                </View>
                              ),
                            )}
                        </RowComponent>
                      </ScrollView>
                      <SpaceComponent height={15} />
                    </>
                  ) : (
                    <></>
                  )}

                  <TextComponent
                    text="Cập nhật kết quả"
                    size={16}
                    font={fontFamilies.bold}
                  />
                  <SpaceComponent height={10} />

                  <InputComponent
                    onChange={(val: string) => handleChangeValue('result', val)}
                    value={workFormUpdate.result}
                    multiple
                    numberOfLines={2}
                    placeholder="Viết kết quả ở đây..."
                    affix={<Edit2 size={22} color={appColors.text} />}
                    styleInput={{alignItems: 'center'}}
                    allowClear
                  />
                </>
              )}

            <SpaceComponent height={15} />
            <ButtonComponent
              text="Cập nhật kết quả công việc"
              type="primary"
              styles={{backgroundColor: appColors.warning}}
              onPress={handleUpdateWork}
            />
            <SpaceComponent height={15} />

            {(workFormUpdate.status === 'completed' ||
              workSessionById.status === 'completed') &&
              workFormUpdate.status !== 'rejected' && (
                <>
                  {workSessionById.comments &&
                  commentById &&
                  commentById[0]?.comment ? (
                    <>
                      <TextComponent
                        text="Bạn đã gửi nhận xét khách hàng đến với Admin"
                        size={16}
                      />
                      <SpaceComponent height={15} />
                    </>
                  ) : (
                    <>
                      <TextComponent
                        text="III. Nhận xét khách hàng"
                        size={18}
                        font={fontFamilies.bold}
                      />
                      <TextComponent
                        text="Cảm nhận của bạn"
                        size={16}
                        font={fontFamilies.bold}
                      />
                      <SpaceComponent height={10} />
                      <InputComponent
                        onChange={val => setComment(val)}
                        value={comment}
                        multiple
                        numberOfLines={2}
                        placeholder="Viết nhận xét ở đây..."
                        affix={<Edit2 size={22} color={appColors.text} />}
                        styleInput={{alignItems: 'center'}}
                        allowClear
                      />
                      <SpaceComponent height={15} />
                      <ButtonComponent
                        text="Gửi nhận xét"
                        type="primary"
                        styles={{backgroundColor: appColors.success}}
                        onPress={handleSubmitComment}
                      />
                      <SpaceComponent height={15} />
                    </>
                  )}
                </>
              )}
          </>
        ) : (
          <>
            <TextComponent
              text="II. Thợ cập nhật công việc"
              size={18}
              font={fontFamilies.bold}
            />

            <SpaceComponent height={15} />
            <TextComponent
              text="Cập nhật trạng thái nhiệm vụ"
              size={16}
              font={fontFamilies.bold}
            />
            <SpaceComponent height={10} />

            {/* <DropDownPickerStatusComponent
              selected={workSessionById.status}
              onSelect={val => handleChangeValue('status', val)}
              items={statusSelect}
            /> */}

            <DropDownPickerStatusComponent
              selected={workFormUpdate.status}
              items={statusSelect}
              onSelect={val => handleChangeValue('status', val)}
            />

            {workFormUpdate.status === 'rejected' && (
              <>
                <TextComponent
                  text="Lý do từ chối"
                  size={16}
                  font={fontFamilies.bold}
                />
                <SpaceComponent height={10} />

                <InputComponent
                  onChange={(val: string) =>
                    handleChangeValue('rejection_reason', val)
                  }
                  value={workFormUpdate.rejection_reason}
                  multiple
                  numberOfLines={2}
                  placeholder="Viết lý do ở đây..."
                  affix={<Edit2 size={22} color={appColors.text} />}
                  styleInput={{alignItems: 'center'}}
                  allowClear
                />
              </>
            )}

            {(workFormUpdate.status === 'completed' ||
              workSessionById.status === 'completed') &&
              workFormUpdate.status !== 'rejected' && (
                <>
                  <RowComponent justify="space-between">
                    <TextComponent
                      text="Lịch bảo trì"
                      size={16}
                      font={fontFamilies.bold}
                    />
                    {existingMaintanceSchedule?.length > 0 ? (
                      <>
                        <TextComponent
                          text={`${DateTime.dateToDateString(
                            existingMaintanceSchedule[0].scheduled_date,
                          )}`}
                          size={16}
                        />
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('AddNewScheduleScreen', {
                              workSessionId: id,
                              employeeId: staffById?._id,
                              customerId: customerById?._id,
                            })
                          }>
                          <AddSquare
                            size={22}
                            color={appColors.primary}
                            variant="Bold"
                          />
                        </TouchableOpacity>
                      </>
                    )}
                  </RowComponent>
                  <SpaceComponent height={15} />

                  <RowComponent justify="space-between">
                    <TextComponent
                      text="Cập nhật hình ảnh trước khi sửa"
                      size={16}
                      font={fontFamilies.bold}
                    />

                    {workFormUpdate.before_images.length > 0 ? (
                      <>
                        <DocumentUpload
                          size={22}
                          variant="Bold"
                          color={appColors.primary}
                          onPress={handleUploadBeforeImages}
                        />
                      </>
                    ) : (
                      <></>
                    )}

                    <Camera
                      size="22"
                      color={appColors.primary}
                      variant="Bold"
                      onPress={() => {
                        setVisibleChoiceFileBefore(true);
                      }}
                    />
                  </RowComponent>
                  <SpaceComponent height={15} />
                  {workFormUpdate.before_images.length > 0 ? (
                    <>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <RowComponent styles={{paddingVertical: 10}}>
                          {Array.isArray(workFormUpdate.before_images) &&
                            workFormUpdate.before_images.map(
                              (image: any, index: any) => (
                                <View
                                  key={index}
                                  style={{
                                    position: 'relative',
                                    marginRight: 20,
                                  }}>
                                  <AntDesign
                                    name="close"
                                    size={20}
                                    color={appColors.white}
                                    style={{
                                      position: 'absolute',
                                      right: -10,
                                      top: -10,
                                      zIndex: 1,
                                      backgroundColor: appColors.red,
                                      borderRadius: 999,
                                    }}
                                    // onPress={() => removeImage(item.id, index)}
                                    onPress={() =>
                                      handleDeletedImageFile('before', index)
                                    }
                                  />
                                  <Image
                                    source={{uri: image}}
                                    style={{
                                      width: 100,
                                      height: 150,
                                      borderRadius: 10,
                                    }}
                                  />
                                </View>
                              ),
                            )}
                        </RowComponent>
                      </ScrollView>
                      <SpaceComponent height={15} />
                    </>
                  ) : (
                    <>
                      <TextComponent text="Hiện chưa có ảnh nào để tải lên hệ thống" />
                      <SpaceComponent height={15} />
                    </>
                  )}

                  {workSessionById.before_images.length > 0 ? (
                    <>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <RowComponent styles={{paddingVertical: 10}}>
                          {Array.isArray(workSessionById.before_images) &&
                            workSessionById.before_images.map(
                              (image: any, index: any) => (
                                <View
                                  key={index}
                                  style={{
                                    position: 'relative',
                                    marginRight: 20,
                                  }}>
                                  {/* <AntDesign
                                  name="close"
                                  size={20}
                                  color={appColors.white}
                                  style={{
                                    position: 'absolute',
                                    right: -10,
                                    top: -10,
                                    zIndex: 1,
                                    backgroundColor: appColors.red,
                                    borderRadius: 999,
                                  }}
                                  // onPress={() => removeImage(item.id, index)}
                                  // onPress={() => handleDeletedImageFile('before', index)}
                                /> */}
                                  <Image
                                    source={{uri: image}}
                                    style={{
                                      width: 100,
                                      height: 150,
                                      borderRadius: 10,
                                    }}
                                  />
                                </View>
                              ),
                            )}
                        </RowComponent>
                      </ScrollView>
                      <SpaceComponent height={15} />
                    </>
                  ) : (
                    <></>
                  )}

                  {/* {workFormUpdate.before_image_firebase.length > 0 ? (
                  <>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}>
                      <RowComponent styles={{paddingVertical: 10}}>
                        {Array.isArray(workFormUpdate.before_image_firebase) &&
                          workFormUpdate.before_image_firebase.map(
                            (image: any, index: any) => (
                              <View
                                key={index}
                                style={{position: 'relative', marginRight: 20}}>
                                <AntDesign
                                  name="close"
                                  size={20}
                                  color={appColors.white}
                                  style={{
                                    position: 'absolute',
                                    right: -10,
                                    top: -10,
                                    zIndex: 1,
                                    backgroundColor: appColors.red,
                                    borderRadius: 999,
                                  }}
                                  // onPress={() => removeImage(item.id, index)}
                                  // onPress={() => handleDeletedImageFile('before', index)}
                                />
                                <Image
                                  source={{uri: image}}
                                  style={{width: 100, height: 150, borderRadius: 10}}
                                />
                              </View>
                            ),
                          )}
                      </RowComponent>
                    </ScrollView>
                    <SpaceComponent height={15} />
                  </>
                ) : (
                  <></>
                )} */}

                  <RowComponent justify="space-between">
                    <TextComponent
                      text="Cập nhật hình ảnh sau khi sửa"
                      size={16}
                      font={fontFamilies.bold}
                    />

                    {workFormUpdate.after_images.length > 0 ? (
                      <>
                        <DocumentUpload
                          size={22}
                          variant="Bold"
                          color={appColors.primary}
                          onPress={handleUploadAfterImages}
                        />
                      </>
                    ) : (
                      <></>
                    )}

                    <Camera
                      size="22"
                      color={appColors.primary}
                      variant="Bold"
                      onPress={() => setVisibleChoiceFileAfter(true)}
                    />
                  </RowComponent>
                  <SpaceComponent height={15} />

                  {workFormUpdate.after_images.length > 0 ? (
                    <>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <RowComponent styles={{paddingVertical: 10}}>
                          {Array.isArray(workFormUpdate.after_images) &&
                            workFormUpdate.after_images.map(
                              (image: any, index: any) => (
                                <View
                                  key={index}
                                  style={{
                                    position: 'relative',
                                    marginRight: 20,
                                  }}>
                                  <AntDesign
                                    name="close"
                                    size={20}
                                    color={appColors.white}
                                    style={{
                                      position: 'absolute',
                                      right: -10,
                                      top: -10,
                                      zIndex: 1,
                                      backgroundColor: appColors.red,
                                      borderRadius: 999,
                                    }}
                                    // onPress={() => removeImage(item.id, index)}
                                    onPress={() =>
                                      handleDeletedImageFile('after', index)
                                    }
                                  />
                                  <Image
                                    source={{uri: image}}
                                    style={{
                                      width: 100,
                                      height: 150,
                                      borderRadius: 10,
                                    }}
                                  />
                                </View>
                              ),
                            )}
                        </RowComponent>
                      </ScrollView>
                      <SpaceComponent height={15} />
                    </>
                  ) : (
                    <>
                      <TextComponent text="Hiện chưa có ảnh nào để tải lên hệ thống" />
                      <SpaceComponent height={15} />
                    </>
                  )}

                  {/* workSessionById */}
                  {workSessionById.after_images.length > 0 ? (
                    <>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <RowComponent styles={{paddingVertical: 10}}>
                          {Array.isArray(workSessionById.after_images) &&
                            workSessionById.after_images.map(
                              (image: any, index: any) => (
                                <View
                                  key={index}
                                  style={{
                                    position: 'relative',
                                    marginRight: 20,
                                  }}>
                                  {/* <AntDesign
                                  name="close"
                                  size={20}
                                  color={appColors.white}
                                  style={{
                                    position: 'absolute',
                                    right: -10,
                                    top: -10,
                                    zIndex: 1,
                                    backgroundColor: appColors.red,
                                    borderRadius: 999,
                                  }}
                                  // onPress={() => removeImage(item.id, index)}
                                  // onPress={() => handleDeletedImageFile('before', index)}
                                /> */}
                                  <Image
                                    source={{uri: image}}
                                    style={{
                                      width: 100,
                                      height: 150,
                                      borderRadius: 10,
                                    }}
                                  />
                                </View>
                              ),
                            )}
                        </RowComponent>
                      </ScrollView>
                      <SpaceComponent height={15} />
                    </>
                  ) : (
                    <></>
                  )}

                  <TextComponent
                    text="Cập nhật kết quả"
                    size={16}
                    font={fontFamilies.bold}
                  />
                  <SpaceComponent height={10} />

                  <InputComponent
                    onChange={(val: string) => handleChangeValue('result', val)}
                    value={workFormUpdate.result}
                    multiple
                    numberOfLines={2}
                    placeholder="Viết kết quả ở đây..."
                    affix={<Edit2 size={22} color={appColors.text} />}
                    styleInput={{alignItems: 'center'}}
                    allowClear
                  />
                </>
              )}

            <SpaceComponent height={15} />
            <ButtonComponent
              text="Cập nhật kết quả công việc"
              type="primary"
              styles={{backgroundColor: appColors.warning}}
              onPress={handleUpdateWork}
            />
            <SpaceComponent height={15} />

            {(workFormUpdate.status === 'completed' ||
              workSessionById.status === 'completed') &&
              workFormUpdate.status !== 'rejected' && (
                <>
                  {workSessionById.comments &&
                  commentById &&
                  commentById[0]?.comment ? (
                    <>
                      <TextComponent
                        text="Bạn đã gửi nhận xét khách hàng đến với Admin"
                        size={16}
                      />
                      <SpaceComponent height={15} />
                    </>
                  ) : (
                    <>
                      <TextComponent
                        text="III. Nhận xét khách hàng"
                        size={18}
                        font={fontFamilies.bold}
                      />
                      <TextComponent
                        text="Cảm nhận của bạn"
                        size={16}
                        font={fontFamilies.bold}
                      />
                      <SpaceComponent height={10} />
                      <InputComponent
                        onChange={val => setComment(val)}
                        value={comment}
                        multiple
                        numberOfLines={2}
                        placeholder="Viết nhận xét ở đây..."
                        affix={<Edit2 size={22} color={appColors.text} />}
                        styleInput={{alignItems: 'center'}}
                        allowClear
                      />
                      <SpaceComponent height={15} />
                      <ButtonComponent
                        text="Gửi nhận xét"
                        type="primary"
                        styles={{backgroundColor: appColors.success}}
                        onPress={handleSubmitComment}
                      />
                      <SpaceComponent height={15} />
                    </>
                  )}
                </>
              )}
          </>
        )}
      </>
    );
  };

  return (
    <ContainerComponent back isScroll title="Chi tiết công việc">
      <SectionComponent>
        {isLoading ? (
          <ActivityIndicator />
        ) : userData ? (
          userData.role === 'admin' ? (
            renderAdminView()
          ) : userData.role === 'employee' ? (
            renderEmployeeView()
          ) : (
            <TextComponent text="Vai trò không hợp lệ" color={appColors.red} />
          )
        ) : (
          <SectionComponent styles={[globalStyles.center, {flex: 1}]}>
            <Octicons name="inbox" size={38} color={appColors.gray3} />
            <TextComponent text="Trống" color={appColors.gray3} />
          </SectionComponent>
        )}
      </SectionComponent>
      <ModalSelectedFile
        visible={visibleChoiceFileBefore}
        onClose={() => setVisibleChoiceFileBefore(false)}
        onSelectedFile={file => handleSelectedFile(file, 'before')}
      />
      <ModalSelectedFile
        visible={visibleChoiceFileAfter}
        onClose={() => setVisibleChoiceFileAfter(false)}
        onSelectedFile={file => handleSelectedFile(file, 'after')}
      />
      {workSessionById &&
        workSessionById.amount &&
        workSessionById.payment_amount && (
          <EditWorkSessionModal
            title="Chỉnh sửa phiên làm việc"
            visible={isVisibleEditModal}
            onClose={() => setIsVisibleEditModal(!isVisibleEditModal)}
            onUpdate={() => navigation.goBack()}
            workId={id}
            amount={workSessionById.amount}
            payment_amount={workSessionById.payment_amount}
          />
        )}
    </ContainerComponent>
  );
};

export default WorkDetailScreen;
