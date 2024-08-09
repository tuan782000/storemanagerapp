import {
  Camera,
  Key,
  Logout,
  User,
  UserSquare,
  WalletMoney,
} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {
  ButtonImagePicker,
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
import {ImageOrVideo} from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import {useDispatch} from 'react-redux';
import {removeAuth} from '../../redux/reducers/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HandleUserAPI} from '../../apis/handleUserAPI';

const ProfileScreen = () => {
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [userId, setUserId] = useState('');
  const [isVisibleEditModal, setIsVisibleEditModal] = useState(false);
  const [isVisibledResetPassword, setIsVisibledResetPassword] = useState(false);

  const [oldImageUrl, setOldImageUrl] = useState<string | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const user = await AsyncStorage.getItem('auth');
    if (user) {
      const parsedUser = JSON.parse(user);
      const api = `/info?id=${parsedUser.id}`;
      setUserId(parsedUser.id);
      try {
        const res = await HandleUserAPI.Info(api);
        setUserData(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng: ', error);
      }
    }
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('auth');
    dispatch(removeAuth({}));
    Toast.show({
      type: 'error',
      text1: 'Đăng xuất',
      text2: 'Đăng xuất thành công',
      visibilityTime: 1000,
    });
  };

  const handleImageSelect = async (val: {
    type: 'url' | 'file';
    value: string | ImageOrVideo;
  }) => {
    const user = await AsyncStorage.getItem('auth');

    if (val.type === 'file' && user) {
      const parsedUser = JSON.parse(user);
      const image = val.value as ImageOrVideo;
      const filePath = image.path;
      const fileName = `${parsedUser.id}_${Date.now()}`;
      const storageRef = storage().ref(`profilePictures/${fileName}`);

      try {
        await storageRef.putFile(filePath);
        const downloadUrl = await storageRef.getDownloadURL();
        await updateUserProfilePicture(downloadUrl);
        if (oldImageUrl) {
          await deleteOldImage(oldImageUrl);
        }
      } catch (error) {
        console.error('Error uploading file: ', error);
      }
    } else if (val.type === 'url' && typeof val.value === 'string') {
      await updateUserProfilePicture(val.value);
      if (oldImageUrl) {
        await deleteOldImage(oldImageUrl);
      }
    }
  };

  const updateUserProfilePicture = async (newImageUrl: string) => {
    const user = await AsyncStorage.getItem('auth');
    if (user) {
      const parsedUser = JSON.parse(user);

      try {
        // call api để set lại link
        const api = `/editInfoAvatar?id=${parsedUser.id}`;
        await HandleUserAPI.Info(api, {profilePicture: newImageUrl}, 'put');
        // await firestore().collection('users').doc(user.uid).update({
        //   profilePicture: newImageUrl,
        // });

        setUserData(prevState =>
          prevState ? {...prevState, profilePicture: newImageUrl} : null,
        );
        setOldImageUrl(newImageUrl);
        Toast.show({
          type: 'success',
          text1: 'Cập nhật ảnh đại diện thành công',
        });
      } catch (error) {
        console.error('Error updating profile picture: ', error);
      }
    }
  };

  const deleteOldImage = async (imageUrl: string) => {
    try {
      const storageRef = storage().refFromURL(imageUrl);
      await storageRef.delete();
    } catch (error) {
      console.error('Error deleting old profile picture: ', error);
    }
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
              // borderWidth: 1,
              // borderColor: appColors.primary,
            }}>
            {/* <Image
              source={require('../../assets/images/icon-logo.png')}
              style={{width: 60, height: 60}}
              resizeMode="cover"
            /> */}
            <Image
              source={
                userData?.profilePicture
                  ? {
                      uri: userData?.profilePicture,
                    }
                  : require('../../assets/images/icon-logo.png')
              }
              style={{width: 100, height: 100, borderRadius: 999}}
              resizeMode="cover"
            />
          </View>
          <SpaceComponent width={20} />
          <View style={{flex: 1}}>
            <RowComponent>
              <User size={20} color={appColors.text} />
              <SpaceComponent width={10} />
              <TextComponent text={userData ? userData.username : ''} />
            </RowComponent>
            <SpaceComponent height={10} />
            {/* <TextComponent text={user ? user.uid : ''} /> */}
            <RowComponent>
              <WalletMoney size={20} color={appColors.text} />
              <SpaceComponent width={10} />
              <TextComponent text="10.000.000 vnđ" />
            </RowComponent>
            <SpaceComponent height={10} />
            <RowComponent>
              <Camera size={20} color={appColors.text} />
              <SpaceComponent width={10} />
              {/* <TextComponent text="Đổi ảnh đại diện" /> */}
              <ButtonImagePicker onSelect={handleImageSelect} />
            </RowComponent>

            <TextComponent text={''} />
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
        userId={userId}
      />
      <ResetPasswordModal
        visible={isVisibledResetPassword}
        onClose={() => setIsVisibledResetPassword(!isVisibledResetPassword)}
        onUpdate={fetchUserData}
      />
    </ContainerComponent>
  );
};

export default ProfileScreen;
