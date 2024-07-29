import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  CardComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';
import ButtonComponent from '../../components/ButtonComponent';
import {appColors} from '../../constants/colors';
import DividerComponent from '../../components/DividerComponent';
import {Add, Call, SearchNormal1} from 'iconsax-react-native';
import {globalStyles} from '../../styles/globalStyle';
import SwipeableFlatList from 'rn-gesture-swipeable-flatlist';
import Octicons from 'react-native-vector-icons/Octicons';

const StaffScreen = ({navigation}: any) => {
  const data = [
    {
      id: '1',
      employeeId: '1234567890',
      name: 'Nguyễn Văn A',
      phone: '0778748993',
      email: 'tho01@gmail.com',
      startDate: '12-12-2022',
    },
    {
      id: '2',
      employeeId: '1234512345',
      name: 'Nguyễn Văn B',
      phone: '0778707787',
      email: 'tho02@gmail.com',
      startDate: '21-12-2022',
    },
    {
      id: '3',
      employeeId: '6789067890',
      name: 'Nguyễn Văn C',
      phone: '0899748993',
      email: 'tho03@gmail.com',
      startDate: '24-12-2022',
    },
    {
      id: '4',
      employeeId: '4567867890',
      name: 'Nguyễn Văn D',
      phone: '07745678993',
      email: 'tho04@gmail.com',
      startDate: '12-01-2022',
    },
    {
      id: '5',
      employeeId: '1234567890',
      name: 'Nguyễn Văn E',
      phone: '0776748993',
      email: 'tho05@gmail.com',
      startDate: '22-02-2022',
    },
    // Thêm các mục dữ liệu khác
  ];

  // state này để lưu từ khoá người dùng nhập
  const [searchQuery, setSearchQuery] = useState('');
  // state này dùng để lưu trũ data
  const [filteredData, setFilteredData] = useState(data);

  // useEffect này dùng để theo dõi state từ khoá - mỗi lần thay đổi nó sẽ tìm kiếm dựa trên data
  useEffect(() => {
    const filtered = data.filter(
      item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredData(filtered);
  }, [searchQuery]);

  const renderItem = ({item}: {item: (typeof data)[0]}) => (
    <CardComponent>
      <RowComponent>
        <TextComponent text="Mã số nhân viên: " />
        <TextComponent text={item.employeeId} />
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
            <TextComponent text={item.startDate} />
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
