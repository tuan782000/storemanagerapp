import {View, Text, Image, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {UserModel} from '../../models/UserModel';
import firestore from '@react-native-firebase/firestore';
import {appColors} from '../../constants/colors';
import {globalStyles} from '../../styles/globalStyle';
import Octicons from 'react-native-vector-icons/Octicons';
import {fontFamilies} from '../../constants/fontFamilies';
import {DateTime} from '../../utils/DateTime';
import ButtonComponent from '../../components/ButtonComponent';
import {DeleteUserConfirmModal} from '../../modals';

const StaffDetailScreen = ({navigation, route}: any) => {
  const {id} = route.params;
  //   console.log(id);

  const [infoUser, setInfoUser] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleDeleteStaff, setIsVisibleDeleteStaff] = useState(false);

  useEffect(() => {
    handleGetUserWithId(id);
  }, [id]);

  const handleGetUserWithId = async (id: string) => {
    setIsLoading(true);

    try {
      const userDoc = await firestore().collection('users').doc(id).get();

      if (userDoc.exists) {
        const userData = userDoc.data() as UserModel;
        setInfoUser(userData);
      } else {
        console.log('No such user!');
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //   console.log(infoUser);
  const getDisplayLabel = (key: string) => {
    switch (key) {
      case 'username':
        return 'Tên tài khoản';
      case 'role':
        return 'Vai trò';
      case 'email':
        return 'Email';
      case 'name':
        return 'Họ và tên';
      case 'created_at':
        return 'Ngày tham gia';
      case 'phone':
        return 'Số điện thoại';
      case 'updated_at':
        return 'Ngày thông tin được cập nhật';
      default:
        return key; // Hiển thị key gốc nếu không khớp với bất kỳ trường hợp nào
    }
  };

  return (
    <ContainerComponent back isScroll title="Thông tin chi tiết nhân viên">
      <SectionComponent>
        {isLoading ? (
          <ActivityIndicator />
        ) : infoUser ? (
          <>
            <View
              style={{
                borderRadius: 999,
                borderColor: appColors.primary,
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/images/icon-logo.png')}
                style={{width: 150, height: 150}}
                resizeMode="contain"
              />
              <SpaceComponent height={20} />
              <ButtonComponent
                text="Đổi ảnh đại diện"
                type="link"
                onPress={() => console.log('Đổi ảnh đại diện')}
              />
            </View>
            <SpaceComponent height={20} />
            {Object.entries(infoUser).map(([key, value]) => (
              <RowComponent
                key={key}
                styles={{
                  marginBottom: 8,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}>
                <TextComponent
                  text={getDisplayLabel(key)}
                  size={16}
                  font={fontFamilies.bold}
                />
                {/* <TextComponent text={value} size={16} /> */}
                <SpaceComponent height={10} />
                <InputComponent
                  value={
                    key === 'created_at' || key === 'updated_at'
                      ? DateTime.timestampToVietnamDate(value)
                      : value
                  }
                  onChange={() => {}}
                  disabled={false}
                  styleDisabled={{backgroundColor: appColors.disabled}}
                />
              </RowComponent>
            ))}
            <ButtonComponent
              text="Cập nhật thông tin nhân viên"
              onPress={() => {}}
              type="primary"
              color={appColors.edit}
            />
            <SpaceComponent height={10} />
            <ButtonComponent
              text="Xoá nhân viên"
              onPress={() => setIsVisibleDeleteStaff(true)}
              type="primary"
              color={appColors.red}
            />
          </>
        ) : (
          <SectionComponent styles={[globalStyles.center, {flex: 1}]}>
            <Octicons name="inbox" size={38} color={appColors.gray3} />
            <TextComponent text="Trống" color={appColors.gray3} />
          </SectionComponent>
        )}
      </SectionComponent>
      <DeleteUserConfirmModal
        onClose={() => setIsVisibleDeleteStaff(!isVisibleDeleteStaff)}
        visible={isVisibleDeleteStaff}
        userId={id}
      />
    </ContainerComponent>
  );
};

export default StaffDetailScreen;
