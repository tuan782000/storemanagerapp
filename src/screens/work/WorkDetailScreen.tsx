import {View, Text, ActivityIndicator, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  ContainerComponent,
  DropDownPickerStatusComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {UserModel} from '../../models/UserModel';
import {HandleUserAPI} from '../../apis/handleUserAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {globalStyles} from '../../styles/globalStyle';
import {appColors} from '../../constants/colors';
import Octicons from 'react-native-vector-icons/Octicons';
import {HandleWorkSessionAPI} from '../../apis/handleWorkSessionAPI';
import {fontFamilies} from '../../constants/fontFamilies';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {formatCurrencyVND} from '../../utils/moneyFormatCurrency';
import {DateTime} from '../../utils/DateTime';
import {HandleCustomerAPI} from '../../apis/handleCustomerAPI';
import Toast from 'react-native-toast-message';
import ButtonComponent from '../../components/ButtonComponent';
import {HandleCommentAPI} from '../../apis/handleCommentAPI';
import {AddSquare} from 'iconsax-react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {HandleMaintanceScheduleAPI} from '../../apis/handleMaintanceScheduleAPI';
import {TaskStatus} from '../../models/WorkSessionModel';
import {SelectModel} from '../../models/SelectModel';
import {SelectStatusModel} from '../../models/SelectStatusModel';

const initialStatus = [
  {
    id: 0,
    value: TaskStatus.Assigned,
  },
  {
    id: 1,
    value: TaskStatus.Accepted,
  },
  {
    id: 2,
    value: TaskStatus.Pending,
  },
  {
    id: 3,
    value: TaskStatus.Rejected,
  },
  {
    id: 4,
    value: TaskStatus.Completed,
  },
  // Assigned, // đã giao
  // Accepted, // đã chấp nhận
  // Pending, // đang xử lý
  // Rejected, // từ chối nhiệm vụ
  // Completed, // hoàn thành
];

const initialUpdateWorkSession = {
  status: 0, // Thay đổi giá trị theo yêu cầu của bạn
  rejection_reason: '', // Có thể là null nếu không có lý do từ chối
  before_image: [] as string[], // Danh sách các URL hình ảnh trước khi làm
  after_image: [] as string[], // Danh sách các URL hình ảnh sau khi làm
  comments: '', // Có thể là null nếu không có nhận xét
  result: '', // Có thể là null nếu không có kết quả
};

const initialErrors = {
  rejection_reason: '',
  before_image: '',
  after_image: '',
  comments: '',
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

  const [statusSelect, setStatusSelect] = useState<SelectStatusModel[]>([]);

  console.log(workFormUpdate.status);

  useEffect(() => {
    fetchUserData();
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
      handleGetAllStatus();
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
    // console.log(id);

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
    console.log(employee_id, customer_id);
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
    const items: SelectStatusModel[] = [];
    await initialStatus.forEach(status => {
      items.push({
        label: status.value,
        value: status.id,
      });
    });
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

  console.log(workSessionById);
  // console.log(staffById);
  // console.log(customerById);
  // console.log(existingMaintanceSchedule);
  // console.log(commentById);
  // console.log(commentById[0]?.comment);
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

        <RowComponent>
          <TextComponent text="Lịch bảo trì: " size={16} />
          {workSessionById.maintenance_schedule ? (
            <></>
          ) : (
            <>
              <TextComponent text="Hiện chưa có lịch bảo trì" size={16} />
            </>
          )}
        </RowComponent>
        <SpaceComponent height={15} />

        {workSessionById.rejection_reason ? (
          <>
            <TextComponent text="Lý do từ chối" size={16} />
            <TextComponent text={workSessionById.rejection_reason} size={16} />
            <SpaceComponent height={15} />
          </>
        ) : (
          <>
            <RowComponent>
              <TextComponent text="Hiện chưa có lý do từ chối" size={16} />
            </RowComponent>
            <SpaceComponent height={15} />
          </>
        )}
        {workSessionById.before_image.length > 0 ? (
          <></>
        ) : (
          <>
            <TextComponent text="Hiện chưa có ảnh trước khi sửa" size={16} />
            <SpaceComponent height={15} />
          </>
        )}
        {workSessionById.after_image.length > 0 ? (
          <></>
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
            <TextComponent text="Hiện chưa có kết quả công việc" size={16} />
            <SpaceComponent height={15} />
          </>
        )}
        {workSessionById.comments && commentById && commentById[0]?.comment ? (
          <>
            <TextComponent text="Bình luận" size={16} />
            <SpaceComponent height={10} />
            <TextComponent text={commentById[0]?.comment} size={16} />
            <SpaceComponent height={15} />
          </>
        ) : (
          <>
            <TextComponent text="Hiện chưa có bình luận" size={16} />
            <SpaceComponent height={15} />
          </>
        )}

        {workSessionById.status === 'assigned' ? (
          <>
            <ButtonComponent
              text="Chỉnh sửa công việc"
              onPress={() => console.log('Chỉnh sửa công việc')}
              type="primary"
              color={appColors.warning}
            />
            <SpaceComponent height={15} />
          </>
        ) : (
          <></>
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
        <TextComponent
          text="II. Thợ cập nhật công việc"
          size={18}
          font={fontFamilies.bold}
        />
        <SpaceComponent height={15} />

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
                <AddSquare size={22} color={appColors.primary} variant="Bold" />
              </TouchableOpacity>
            </>
          )}
        </RowComponent>

        <SpaceComponent height={15} />
        <TextComponent
          text="Cập nhật trạng thái nhiệm vụ"
          size={16}
          font={fontFamilies.bold}
        />
        <SpaceComponent height={10} />

        {/* <DropDownPickerStatusComponent onSelect={}/> */}
        {/* <DropDownPickerStatusComponent
          title="Chọn trạng thái công việc" // Optional title
          selected={selectedStatus} // The currently selected status
          onSelect={handleStatusSelect} // Function to handle the status selection
        /> */}
        <DropDownPickerStatusComponent
          selected={workSessionById.status}
          onSelect={val => handleChangeValue('status', val)}
          items={statusSelect}
        />

        <TextComponent
          text="Cập nhật hình ảnh trước khi sửa"
          size={16}
          font={fontFamilies.bold}
        />

        <SpaceComponent height={15} />
        <TextComponent
          text="Cập nhật hình ảnh sau khi sửa"
          size={16}
          font={fontFamilies.bold}
        />
        <SpaceComponent height={15} />
        <TextComponent
          text="Cập nhật kết quả"
          size={16}
          font={fontFamilies.bold}
        />
        <SpaceComponent height={10} />

        <InputComponent
          onChange={() => {}}
          value=""
          multiple
          numberOfLines={2}
        />
        <SpaceComponent height={15} />
        <TextComponent
          text="Nhận xét khách hàng"
          size={16}
          font={fontFamilies.bold}
        />
        <SpaceComponent height={10} />
        <InputComponent
          onChange={() => {}}
          value=""
          multiple
          numberOfLines={2}
        />
        <SpaceComponent height={15} />
        <ButtonComponent
          text="Cập nhật kết quả công việc"
          type="primary"
          styles={{backgroundColor: appColors.warning}}
        />
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
    </ContainerComponent>
  );
};

export default WorkDetailScreen;
