import {View, Text, TouchableOpacity, FlatList, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  CardComponent,
  ContainerComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';
import TabComponent, {TabButtonType} from '../../components/TabComponent';
// import {TaskStatus, TasksModel} from '../../models/TasksModel';
import {appColors} from '../../constants/colors';
import {
  Add,
  Book1,
  Call,
  Location,
  Money3,
  MoneyRecive,
  MoneySend,
  Status,
  UserSquare,
  WalletMoney,
} from 'iconsax-react-native';
import firestore from '@react-native-firebase/firestore';
import DividerComponent from '../../components/DividerComponent';
import {getLastSevenCharacters} from '../../utils/getLastSevenCharacters';
import {DateTime} from '../../utils/DateTime';
import {globalStyles} from '../../styles/globalStyle';
import Octicons from 'react-native-vector-icons/Octicons';
import WorkSession, {TaskStatus} from '../../models/WorkSessionModel';
import {HandleWorkSessionAPI} from '../../apis/handleWorkSessionAPI';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserModel} from '../../models/UserModel';
import {HandleUserAPI} from '../../apis/handleUserAPI';
import {formatCurrencyVND} from '../../utils/moneyFormatCurrency';
import {CustomerModel} from '../../models/CustomerModel';
import {HandleCustomerAPI} from '../../apis/handleCustomerAPI';
import Toast from 'react-native-toast-message';
import ButtonComponent from '../../components/ButtonComponent';

const WorkScreen = ({navigation}: any) => {
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [customerData, setCustomerData] = useState<any>([]);
  const [listWorkSession, setlistWorkSession] = useState<WorkSession[]>([]);

  // phải call 2 lần useEffect để tránh bị trễ 1 bước
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      // Lắng nghe sự kiện khi màn hình được focus
      const unsubscribe = navigation.addListener('focus', () => {
        fetchTasks();
        fetchCustomerData();
      });

      // Dọn dẹp listener khi component bị unmount
      return unsubscribe;
    }
  }, [navigation, userData]);

  useEffect(() => {
    if (userData) {
      fetchTasks();
      fetchCustomerData();
    }
  }, [userData]);

  const fetchTasks = async () => {
    const userAuth = await AsyncStorage.getItem('auth');
    if (userAuth && userData?.role === 'admin') {
      try {
        const api = '/listWorkSessions';
        const listWork: any = await HandleWorkSessionAPI.WorkSession(api);

        setlistWorkSession(listWork.data);
      } catch (error: any) {
        console.error('Lỗi khi lấy ra các phiên làm việc: ', error);
      }
    } else if (userAuth && userData?.role === 'employee') {
      try {
        const parsedUser = JSON.parse(userAuth);
        const api = `/getWorkSessionsByEmployeeId?employee_id=${parsedUser.id}`;
        const listWork: any = await HandleWorkSessionAPI.WorkSession(api);
        setlistWorkSession(listWork.data);
      } catch (error: any) {
        console.error('Lỗi khi lấy ra các phiên làm việc: ', error);
      }
    }
  };

  const fetchUserData = async () => {
    const user = await AsyncStorage.getItem('auth');
    if (user) {
      const parsedUser = JSON.parse(user);
      const api = `/info?id=${parsedUser.id}`;
      // setuserId(parsedUser.id);
      try {
        const res = await HandleUserAPI.Info(api);
        setUserData(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng: ', error);
      }
    }
  };

  const fetchCustomerData = async () => {
    const api = `/listCustomer`;
    try {
      const res = await HandleCustomerAPI.Customer(api);
      setCustomerData(res.data);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin danh sách khách hàng: ', error);
    }
  };

  const getCustomerInfo = (customer_id: string) => {
    if (!customerData) return {name: '', phone: ''};
    const customer = customerData.find((cust: any) => cust._id === customer_id);
    return customer
      ? {name: customer.name, phone: customer.phone, address: customer.address}
      : {name: '', phone: '', address: ''};
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

  const renderItem = ({item}: any) => {
    const customerInfo = getCustomerInfo(item.customer_id);

    return (
      <CardComponent
        styles={{borderRadius: 12}}
        onPress={() => {
          navigation.navigate('WorkDetailScreen', {
            id: item._id,
          });
        }}>
        <RowComponent styles={{alignItems: 'flex-start'}}>
          <RowComponent
            styles={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}>
            <RowComponent styles={{alignItems: 'flex-start'}}>
              <FontAwesome6
                name="screwdriver-wrench"
                size={25}
                color={appColors.text}
              />
              <SpaceComponent width={15} />
              <TextComponent
                text={item.description}
                styles={{flex: 1, flexWrap: 'wrap'}}
                size={16}
                font={fontFamilies.medium}
              />
            </RowComponent>
            <SpaceComponent height={15} />
            <RowComponent>
              {/* <TextComponent text="Trạng thái: " size={16} /> */}
              <Status size={22} color={appColors.primary} />
              <SpaceComponent width={10} />
              <TextComponent
                size={16}
                text={`${
                  item.status === 'assigned'
                    ? 'Đã giao việc'
                    : item.status === 'accepted'
                    ? 'Thợ đã nhận'
                    : item.status === 'pending'
                    ? 'Thợ đang xử lý'
                    : item.status === 'rejected'
                    ? 'Thợ đã từ chối'
                    : item.status === 'completed'
                    ? 'Đã hoàn thành'
                    : 'Có lỗi xảy ra'
                }`}
                color={appColors.white}
                font={fontFamilies.bold}
                styles={{
                  backgroundColor: `${
                    item.status === 'assigned'
                      ? appColors.primary
                      : item.status === 'accepted'
                      ? appColors.warning
                      : item.status === 'pending'
                      ? appColors.edit
                      : item.status === 'rejected'
                      ? appColors.danager
                      : item.status === 'completed'
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
            {userData?.role === 'admin' && (
              <>
                <RowComponent>
                  {/* <TextComponent text="Số tiền dự án: " size={16} /> */}
                  {/* WalletMoney */}
                  <WalletMoney size={22} color={appColors.primary} />
                  <SpaceComponent width={10} />

                  <TextComponent
                    text={`${formatCurrencyVND(item.amount)}`}
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
                  {/* <TextComponent text="Số tiền nhân viên nhận: " size={16} /> */}
                  {/* MoneySend */}
                  <MoneySend size={22} color={appColors.primary} />
                  <SpaceComponent width={10} />
                  <TextComponent
                    text={`${formatCurrencyVND(item.payment_amount)}`}
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
                  {/* <TextComponent text="Lợi nhuận: " size={16} /> */}
                  <MoneyRecive size={22} color={appColors.primary} />
                  <SpaceComponent width={10} />
                  <TextComponent
                    text={`${formatCurrencyVND(
                      item.amount - item.payment_amount,
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
              </>
            )}
            {userData?.role === 'employee' && (
              <>
                <RowComponent>
                  {/* <TextComponent text="Số tiền nhiệm vụ: " size={16} /> */}
                  <Money3 size={22} color={appColors.primary} />
                  <SpaceComponent width={10} />
                  <TextComponent
                    text={`${formatCurrencyVND(item.payment_amount)}`}
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
              </>
            )}
            <RowComponent>
              <UserSquare size={22} color={appColors.primary} />
              <SpaceComponent width={10} />
              <TextComponent text={customerInfo.name} size={16} />
            </RowComponent>
            <SpaceComponent height={15} />
            <RowComponent styles={{alignItems: 'flex-start'}}>
              <Location size={22} color={appColors.primary} />
              <SpaceComponent width={10} />
              <TextComponent
                text={customerInfo.address}
                size={16}
                styles={{flex: 1, flexWrap: 'wrap'}}
              />
            </RowComponent>
            <SpaceComponent height={15} />
            <RowComponent>
              <Call size={22} color={appColors.primary} />
              <SpaceComponent width={10} />
              <ButtonComponent
                text={customerInfo.phone}
                type="link"
                textAndLinkStyle={{fontSize: 16}}
                onPress={() => makeCall(customerInfo.phone)}
              />
            </RowComponent>
            <SpaceComponent height={15} />
            {/* <RowComponent>
              <TextComponent text="Ngày bắt đầu: " size={16} />
              <TextComponent
                text={`${DateTime.dateToDateString(item.start_time)}`}
              />
            </RowComponent>
            <SpaceComponent height={15} />
            <RowComponent>
              <TextComponent text="Dự kiến hoàn thành: " size={16} />
              <TextComponent
                text={`${DateTime.dateToDateString(item.end_time)}`}
              />
            </RowComponent>
            <SpaceComponent height={15} /> */}
          </RowComponent>
        </RowComponent>
      </CardComponent>
    );
  };

  return (
    <>
      <ContainerComponent>
        <SectionComponent
          styles={{
            marginTop: 10,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            paddingBottom: 0,
          }}>
          <TextComponent
            text="Quản lý công việc"
            title
            font={fontFamilies.bold}
          />
        </SectionComponent>
        <SpaceComponent height={20} />

        <FlatList
          data={listWorkSession}
          renderItem={renderItem}
          ListEmptyComponent={
            <SectionComponent styles={[globalStyles.center, {flex: 1}]}>
              <Octicons name="inbox" size={38} color={appColors.gray3} />
              <TextComponent text="Trống" color={appColors.gray3} />
            </SectionComponent>
          }
        />
      </ContainerComponent>

      {userData?.role === 'admin' && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('AddNewWorkScreen')}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 20,
            backgroundColor: appColors.primary,
            borderRadius: 100,
          }}>
          <Add size={30} color={appColors.white} />
        </TouchableOpacity>
      )}
    </>
  );
};

export default WorkScreen;
