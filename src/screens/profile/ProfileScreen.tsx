import {Key, Logout, UserSquare} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import ButtonComponent from '../../components/ButtonComponent';
import DividerComponent from '../../components/DividerComponent';
import {appColors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {UserModel} from '../../models/UserModel';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {EditAccountModal, ResetPasswordModal} from '../../modals';
import Toast from 'react-native-toast-message';

const ProfileScreen = () => {
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [isVisibleEditModal, setIsVisibleEditModal] = useState(false);
  const [isVisibledResetPassword, setIsVisibledResetPassword] = useState(false);
  const user = auth().currentUser;
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const user = auth().currentUser;
    if (user) {
      try {
        const userDoc: any = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    }
  };

  const handleSignOut = async () => {
    await auth().signOut();
    Toast.show({
      type: 'error',
      text1: 'Đăng xuất',
      text2: 'Đăng xuất thành công',
      visibilityTime: 1000,
    });
    // navigation.navigate('LoginScreen');
  };

  return (
    <ContainerComponent isScroll>
      <SectionComponent styles={{marginTop: 10}}>
        <RowComponent justify="space-between" styles={{alignItems: 'center'}}>
          <TextComponent text="Tài khoản" title font={fontFamilies.bold} />
          <ButtonComponent
            text="Cập nhật"
            color={appColors.edit}
            onPress={() => setIsVisibleEditModal(true)}
            type="primary"
            activeOpacity={0.9}
            styles={{
              paddingHorizontal: 10,
              minHeight: 0,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          />
        </RowComponent>
      </SectionComponent>
      <DividerComponent />
      <SectionComponent
        styles={{
          marginTop: 10,
          borderBottomWidth: 10,
          borderBottomColor: appColors.gray2,
        }}>
        <RowComponent>
          <View
            style={{
              borderRadius: 999,
              borderWidth: 1,
              borderColor: appColors.primary,
            }}>
            <Image
              source={require('../../assets/images/icon-logo.png')}
              style={{width: 60, height: 60}}
            />
          </View>
          <SpaceComponent width={20} />
          <View style={{flex: 1}}>
            <TextComponent text={userData ? userData.username : ''} />
            <SpaceComponent height={2} />
            <TextComponent text={user ? user.uid : ''} />
            <SpaceComponent height={2} />
            <ButtonComponent
              text="Đổi ảnh đại diện"
              type="text"
              textAndLinkStyle={{color: appColors.primary}}
            />
          </View>
        </RowComponent>
      </SectionComponent>
      <SectionComponent
        styles={{
          marginTop: 10,
          borderBottomWidth: 10,
          borderBottomColor: appColors.gray2,
        }}>
        <RowComponent styles={{alignItems: 'flex-start'}}>
          <UserSquare size={22} color={appColors.primary} />
          <SpaceComponent width={10} />
          <View style={{flex: 1}}>
            <TextComponent
              text="Thông tin tài khoản"
              size={18}
              font={fontFamilies.medium}
            />
            <SpaceComponent height={20} />
            <TextComponent text="Họ và tên" />
            <SpaceComponent height={10} />
            <InputComponent
              value={userData ? userData.name : ''}
              onChange={() => {}}
              disabled={false}
              styleInput={{backgroundColor: appColors.disabled}}
            />
            <TextComponent text="Số điện thoại" />
            <SpaceComponent height={10} />
            <InputComponent
              value={userData ? userData.phone : ''}
              onChange={() => {}}
              disabled={false}
              styleInput={{backgroundColor: appColors.disabled}}
            />
            <TextComponent text="Email" />
            <SpaceComponent height={10} />
            <InputComponent
              value={userData ? userData.email : ''}
              onChange={() => {}}
              disabled={false}
              styleInput={{backgroundColor: appColors.disabled}}
            />
          </View>
        </RowComponent>
      </SectionComponent>
      <SectionComponent
        styles={{
          marginTop: 10,
          borderBottomWidth: 10,
          borderBottomColor: appColors.gray2,
        }}>
        <RowComponent styles={{alignItems: 'flex-start'}}>
          <Key size={22} color={appColors.primary} />
          <SpaceComponent width={10} />
          <View style={{flex: 1}}>
            <TextComponent
              text="Thay đổi mật khẩu"
              size={18}
              font={fontFamilies.medium}
            />

            <SpaceComponent height={20} />

            <ButtonComponent
              text="Đổi mật khẩu"
              type="link"
              onPress={() => setIsVisibledResetPassword(true)}
            />
          </View>
        </RowComponent>
      </SectionComponent>
      <SectionComponent
        styles={{
          marginTop: 10,
        }}>
        <RowComponent styles={{alignItems: 'center'}}>
          <Logout size={22} color={appColors.primary} />
          <SpaceComponent width={10} />
          <TextComponent
            text="Đăng xuất"
            size={18}
            font={fontFamilies.medium}
          />
        </RowComponent>
        {/* <TouchableOpacity onPress={handleSignOut}>
        <Logout size={22} color="coral" />
      </TouchableOpacity> */}
        <SpaceComponent height={20} />
        <ButtonComponent
          styles={{backgroundColor: appColors.red}}
          onPress={handleSignOut}
          text="Đăng xuất"
          type="primary"
          iconPostion="right"
          icon={<Logout size={22} color={appColors.white} />}
        />
      </SectionComponent>
      <EditAccountModal
        title="Chỉnh sửa thông tin"
        visible={isVisibleEditModal}
        onClose={() => setIsVisibleEditModal(!isVisibleEditModal)}
        name={userData && userData.name}
        phone={userData && userData.phone}
        onUpdate={fetchUserData}
      />
      <ResetPasswordModal
        visible={isVisibledResetPassword}
        onClose={() => setIsVisibledResetPassword(!isVisibledResetPassword)}
      />
    </ContainerComponent>
  );
};

export default ProfileScreen;
