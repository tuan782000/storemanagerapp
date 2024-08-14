import {View, Text, FlatList, TouchableOpacity, Linking} from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HandleUserAPI} from '../../apis/handleUserAPI';
import {UserModel} from '../../models/UserModel';
import {HandleMaintanceScheduleAPI} from '../../apis/handleMaintanceScheduleAPI';
import {globalStyles} from '../../styles/globalStyle';
import {appColors} from '../../constants/colors';
import Octicons from 'react-native-vector-icons/Octicons';
import {
  Calendar,
  Call,
  Edit2,
  Location,
  UserSquare,
} from 'iconsax-react-native';
import {DateTime} from '../../utils/DateTime';
import {HandleCustomerAPI} from '../../apis/handleCustomerAPI';
import Toast from 'react-native-toast-message';
import ButtonComponent from '../../components/ButtonComponent';

const ScheduleScreen = ({navigation}: any) => {
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [listMaintenanceSchedule, setListMaintenanceSchedule] = useState<any>(
    [],
  );
  const [customerData, setCustomerData] = useState<any>([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchListSchedule();
      fetchCustomerData();
    }
  }, [userData]);

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

  // Lưu ý vấn đề này - [AxiosError: Request failed with status code 404] - nếu bảo trì trống

  const fetchListSchedule = async () => {
    const userAuth = await AsyncStorage.getItem('auth');
    if (userAuth && userData?.role === 'admin') {
      try {
        const api = '/getMaintenanceSchedule';
        const listSchedule: any =
          await HandleMaintanceScheduleAPI.MaintanceSchedule(api);

        setListMaintenanceSchedule(listSchedule.data);
      } catch (error: any) {
        // console.error('Lỗi khi lấy ra các phiên làm việc: ', error);
        Toast.show({
          type: 'info',
          text1: 'Thông báo',
          text2: 'Hiện tại lịch bảo trì đang trống',
          visibilityTime: 1000,
        });
      }
    } else if (userAuth && userData?.role === 'employee') {
      try {
        const parsedUser = JSON.parse(userAuth);
        const api = `/getMaintenanceScheduleByEmployeeId?employee_id=${parsedUser.id}`;
        const listSchedule: any =
          await HandleMaintanceScheduleAPI.MaintanceSchedule(api);
        setListMaintenanceSchedule(listSchedule.data);
      } catch (error: any) {
        // console.error('Lỗi khi lấy ra các phiên làm việc: ', error);
        Toast.show({
          type: 'info',
          text1: 'Thông báo',
          text2: 'Hiện tại lịch bảo trì đang trống',
          visibilityTime: 1000,
        });
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
  console.log(listMaintenanceSchedule);
  const renderItem = ({item}: any) => {
    const customerInfo = getCustomerInfo(item.customer_id);

    return (
      <CardComponent styles={{borderRadius: 12}}>
        <RowComponent styles={{alignItems: 'flex-start'}}>
          <RowComponent
            styles={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}>
            <RowComponent
              styles={{
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <RowComponent>
                <Calendar size={22} color={appColors.primary} />
                <SpaceComponent width={10} />
                <TextComponent
                  text={`${DateTime.dateToDateString(item.scheduled_date)}`}
                  size={16}
                />
              </RowComponent>
              <TextComponent
                text="Hạn bảo trì"
                color={appColors.red}
                font={fontFamilies.bold}
                size={16}
              />
            </RowComponent>
            <SpaceComponent height={10} />
            <RowComponent styles={{alignItems: 'flex-start'}}>
              <Edit2 size={22} color={appColors.primary} />
              <SpaceComponent width={10} />
              <TextComponent text={item.notes} size={16} flex={1} />
            </RowComponent>
            <SpaceComponent height={10} />
            <RowComponent>
              {/* UserSquare */}
              <UserSquare size={22} color={appColors.primary} />
              <SpaceComponent width={10} />
              <TextComponent text={customerInfo.name} size={16} />
            </RowComponent>
            <SpaceComponent height={15} />
            <RowComponent styles={{alignItems: 'flex-start'}}>
              {/* Location */}
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
          </RowComponent>
        </RowComponent>
      </CardComponent>
    );
  };
  return (
    // <ContainerComponent isScroll>
    //   <SectionComponent>
    //     <TextComponent
    //       text="Quản lý lịch bảo trì"
    //       title
    //       font={fontFamilies.bold}
    //     />
    //   </SectionComponent>
    // </ContainerComponent>
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
            text="Quản lý lịch bảo trì"
            title
            font={fontFamilies.bold}
          />
        </SectionComponent>
        <SpaceComponent height={20} />

        <FlatList
          data={listMaintenanceSchedule}
          renderItem={renderItem}
          ListEmptyComponent={
            <SectionComponent styles={[globalStyles.center, {flex: 1}]}>
              <Octicons name="inbox" size={38} color={appColors.gray3} />
              <TextComponent text="Trống" color={appColors.gray3} />
            </SectionComponent>
          }
        />
      </ContainerComponent>
    </>
  );
};

export default ScheduleScreen;
