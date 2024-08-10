import {View, Text, ActivityIndicator, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  ContainerComponent,
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

const WorkDetailScreen = ({navigation, route}: any) => {
  const {id} = route.params;
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [workSessionById, setworkSessionById] = useState<any>();
  const [staffById, setStaffById] = useState<any>();
  const [customerById, setcustomerById] = useState<any>();
  const [commentById, setCommentById] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

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
    console.log(id);

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

  console.log(workSessionById);
  // console.log(staffById);
  // console.log(customerById);
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
                ? 'Thợ đã nhận'
                : workSessionById.status === 'pending'
                ? 'Thợ đang xử lý'
                : workSessionById.status === 'rejected'
                ? 'Thợ đã từ chối'
                : workSessionById.status === 'completed'
                ? 'Đã hoàn thành'
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
        <TextComponent text="Employee" title />
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
