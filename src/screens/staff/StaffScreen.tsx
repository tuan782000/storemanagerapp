import firestore from '@react-native-firebase/firestore';
import {
  Add,
  Calendar,
  Call,
  Money2,
  SearchNormal1,
  Sms,
  User,
} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Image, TouchableOpacity, View, Linking} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import SwipeableFlatList from 'rn-gesture-swipeable-flatlist';
import {
  CardComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import DividerComponent from '../../components/DividerComponent';
import {appColors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {UserModel} from '../../models/UserModel';
import {globalStyles} from '../../styles/globalStyle';
import {DateTime} from '../../utils/DateTime';
import {getLastSevenCharacters} from '../../utils/getLastSevenCharacters';
import Toast from 'react-native-toast-message';
import {HandleUserAPI} from '../../apis/handleUserAPI';
import ButtonComponent from '../../components/ButtonComponent';

type EmployeeData = Pick<
  UserModel,
  `email` | `name` | `phone` | `profilePicture` | `created_at`
> & {
  id: string;
};

const StaffScreen = ({navigation}: any) => {
  // lưu trữ danh sách đã call api lấy về
  const [data, setData] = useState<EmployeeData[]>([]);
  // state này để lưu từ khoá người dùng nhập
  const [searchQuery, setSearchQuery] = useState('');
  // state này dùng để lưu trũ data sau khi search và hiển thị
  const [filteredData, setFilteredData] = useState<EmployeeData[]>([]);

  useEffect(() => {
    // Lắng nghe sự kiện khi màn hình được focus
    const unsubscribe = navigation.addListener('focus', () => {
      getListEmployees();
    });

    // Dọn dẹp listener khi component bị unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    getListEmployees();
  }, []);

  // useEffect này dùng để theo dõi state từ khoá - mỗi lần thay đổi nó sẽ tìm kiếm dựa trên data
  useEffect(() => {
    const filtered = data.filter(
      item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  const getListEmployees = async () => {
    try {
      const response = await HandleUserAPI.Info('/getListEmployees');
      const listUsers: EmployeeData[] = response.data;

      setData(listUsers);
      setFilteredData(listUsers);
    } catch (error: any) {
      console.error('Error fetching data: ', error);
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: error.message,
        visibilityTime: 10000,
      });
    }
  };

  // Hàm này hỗ trợ gọi điện
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

  const renderItem = ({item}: {item: EmployeeData}) => (
    <CardComponent
      onPress={() =>
        navigation.navigate('StaffDetailScreen', {
          id: item.id,
        })
      }>
      <SpaceComponent height={10} />
      <RowComponent styles={{alignItems: 'flex-start'}}>
        <RowComponent
          styles={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
          <RowComponent>
            <User size={20} color={appColors.text} />
            <SpaceComponent width={10} />
            <TextComponent text={item.name} size={16} />
          </RowComponent>
          <SpaceComponent height={10} />
          <RowComponent>
            <Call size={20} color={appColors.text} />
            <SpaceComponent width={10} />
            {/* <TextComponent text={item.phone}  /> */}
            <ButtonComponent
              text={item.phone}
              type="link"
              textAndLinkStyle={{fontSize: 16}}
              onPress={() => makeCall(item.phone)}
            />
          </RowComponent>
          <SpaceComponent height={10} />
          <RowComponent>
            <Money2 size={20} color={appColors.text} />
            <SpaceComponent width={10} />
            <TextComponent text="100.000.000 vnđ" size={16} />
          </RowComponent>
          <SpaceComponent height={10} />
          <RowComponent>
            <Sms size={20} color={appColors.text} />
            <SpaceComponent width={10} />
            <TextComponent text={item.email} size={16} />
          </RowComponent>
          <SpaceComponent height={10} />
          <RowComponent>
            <Calendar size={20} color={appColors.text} />
            <SpaceComponent width={10} />
            <TextComponent
              text={DateTime.timestampToVietnamDate(item.created_at)}
              size={16}
            />
          </RowComponent>
        </RowComponent>
        <View
          style={{
            borderRadius: 999,
          }}>
          <Image
            source={
              item?.profilePicture
                ? {
                    uri: item?.profilePicture,
                  }
                : require('../../assets/images/icon-logo.png')
            }
            style={{width: 100, height: 100, borderRadius: 999}}
            resizeMode="cover"
          />
        </View>
      </RowComponent>
    </CardComponent>
  );

  const renderRightActions = (item: EmployeeData) => {
    // console.log(item.phone, item.id);
    return (
      <View
        style={{
          paddingHorizontal: 20,
          backgroundColor: appColors.primary,
          borderRadius: 8,
          marginBottom: 20,
          marginLeft: -32,
          marginRight: 16,
          justifyContent: 'center',
          alignContent: 'center',
          paddingLeft: 32,
        }}>
        <TouchableOpacity
          onPress={() => makeCall(item.phone)}
          style={{justifyContent: 'center', alignItems: 'center'}}>
          <Call size={22} color={appColors.white} />
        </TouchableOpacity>
      </View>
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
            text="Quản lý nhân viên"
            title
            font={fontFamilies.bold}
          />
          <SpaceComponent height={20} />
          <InputComponent
            value={searchQuery}
            onChange={val => setSearchQuery(val)}
            suffix={<SearchNormal1 size={20} color="#747688" />}
            placeholder="Tìm kiếm nhân viên..."
            allowClear
          />
        </SectionComponent>
        <View style={{flex: 1}}>
          <SwipeableFlatList
            data={filteredData}
            showsVerticalScrollIndicator={false}
            style={{paddingTop: 12}}
            maximumZoomScale={20}
            removeClippedSubviews
            ListEmptyComponent={
              <SectionComponent styles={[globalStyles.center, {flex: 1}]}>
                <Octicons name="inbox" size={38} color={appColors.gray3} />
                <TextComponent text="Trống" color={appColors.gray3} />
              </SectionComponent>
            }
            renderItem={renderItem}
            renderRightActions={renderRightActions}
            keyExtractor={item => item.id}
          />
          <SpaceComponent height={60} />
        </View>
      </ContainerComponent>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddNewUserScreen')}
          activeOpacity={0.9}
          style={[
            globalStyles.row,
            {
              backgroundColor: appColors.primary,
              width: '90%',
              borderRadius: 10,
              padding: 10,
            },
          ]}>
          <TextComponent
            text="Thêm mới nhân viên"
            flex={1}
            color={appColors.white}
            styles={{textAlign: 'center'}}
            font={fontFamilies.medium}
          />
          <Add size={22} color={appColors.white} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default StaffScreen;
