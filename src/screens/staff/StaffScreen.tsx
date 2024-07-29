import firestore from '@react-native-firebase/firestore';
import {Add, Call, SearchNormal1} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
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

type EmployeeData = Pick<
  UserModel,
  `email` | `name` | `phone` | `created_at`
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
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  const getListEmployees = async () => {
    try {
      const snapshot = await firestore()
        .collection('users')
        .where('role', '==', 'employee')
        .get();

      const users: EmployeeData[] = snapshot.docs.map(doc => {
        const data = doc.data() as UserModel;
        return {
          id: doc.id,
          name: data.name,
          phone: data.phone,
          email: data.email,
          created_at: data.created_at,
        };
      });

      setData(users);
      setFilteredData(users);
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

  console.log(filteredData);

  const renderItem = ({item}: {item: EmployeeData}) => (
    <CardComponent
      onPress={() =>
        navigation.navigate('StaffDetailScreen', {
          id: item.id,
        })
      }>
      <RowComponent>
        <TextComponent text="Mã số nhân viên: " />
        <TextComponent text={getLastSevenCharacters(item.id)} />
      </RowComponent>
      <SpaceComponent height={10} />
      <DividerComponent />
      <SpaceComponent height={10} />
      <RowComponent styles={{alignItems: 'flex-start'}}>
        <RowComponent
          styles={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
          <RowComponent>
            <TextComponent text="Họ và tên: " />
            <TextComponent text={item.name} />
          </RowComponent>
          <SpaceComponent height={5} />
          <RowComponent>
            <TextComponent text="Số điện thoại: " />
            <TextComponent text={item.phone} />
          </RowComponent>
          <SpaceComponent height={5} />
          <RowComponent>
            <TextComponent text="Email: " />
            <TextComponent text={item.email} />
          </RowComponent>
          <SpaceComponent height={5} />
          <RowComponent>
            <TextComponent text="Ngày vào làm: " />
            <TextComponent
              text={DateTime.timestampToVietnamDate(item.created_at)}
            />
          </RowComponent>
        </RowComponent>
        <View
          style={{
            borderRadius: 999,
            borderWidth: 1,
            borderColor: appColors.primary,
          }}>
          <Image
            source={require('../../assets/images/icon-logo.png')}
            style={{width: 100, height: 100}}
          />
        </View>
      </RowComponent>
    </CardComponent>
  );

  const renderRightActions = () => (
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
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <Call size={22} color={appColors.white} />
      </TouchableOpacity>
    </View>
  );

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
