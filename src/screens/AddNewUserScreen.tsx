import React, {useEffect, useState} from 'react';
import {
  ContainerComponent,
  InputComponent,
  LoadingComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../components';
import DividerComponent from '../components/DividerComponent';
import {Call, CallAdd, Lock1, Sms, User} from 'iconsax-react-native';
import {appColors} from '../constants/colors';
// import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {extractUsernameFromEmail} from '../utils/extractUsernameFromEmail';
import {UserRole} from '../models/UserModel';
import {View} from 'react-native';
import ButtonComponent from '../components/ButtonComponent';
import bcrypt from 'bcryptjs';
import Toast from 'react-native-toast-message';
import {HandleUserAPI} from '../apis/handleUserAPI';

const initialUser = {
  email: '',
  password: '',
  name: '',
  phone: '',
};

const initialErrors = {
  email: '',
  password: '',
  name: '',
  phone: '',
};

const initialIcons = {
  email: <Sms size={20} color={appColors.gray} />,
  password: <Lock1 size={20} color={appColors.gray} />,
  name: <User size={20} color={appColors.gray} />,
  phone: <CallAdd size={20} color={appColors.gray} />,
};

const AddNewUserScreen = ({navigation}: any) => {
  const [userForm, setUserForm] = useState<any>(initialUser);
  const [errors, setErrors] = useState<any>(initialErrors);
  const icons: any = initialIcons;
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeValue = (key: string, value: string) => {
    const data: any = {...userForm};
    data[`${key}`] = value;

    setUserForm(data);
    handleValidateInput(key, value);
  };

  const handleValidateInput = (key: string, value: string) => {
    const newErrors: any = {...errors};
    switch (key) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        newErrors.email = !emailRegex.test(value)
          ? 'Vui lòng nhập đúng định dạng email'
          : '';
        break;

      case 'password':
        newErrors.password =
          value.length < 6 ? 'Mật khẩu phải lớn hơn 6 ký tự' : '';
        break;

      case 'name':
        newErrors.name = value.length < 3 ? 'Số ký tự phải lớn hơn 3' : '';
        break;

      case 'phone':
        newErrors.phone =
          value.length < 9 || value.length > 12
            ? 'Số điện thoại phải là 10 hoặc 11 số'
            : '';
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleRegister = async () => {
    if (Object.values(errors).some(error => error !== '')) {
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Có lỗi trong form',
        visibilityTime: 1000,
      });
      return;
    }

    setIsLoading(true);

    if (
      userForm.email !== '' &&
      userForm.password !== '' &&
      userForm.name !== '' &&
      userForm.phone !== ''
    ) {
      setErrors(initialErrors);
      try {
        const api = '/registerEmployee';

        await HandleUserAPI.Info(
          api,
          {
            email: userForm.email,
            password: userForm.password,
            username: extractUsernameFromEmail(userForm.email),
            role: UserRole.Employee,
            name: userForm.name,
            phone: userForm.phone,
            created_at: Date.now(),
            updated_at: Date.now(),
          },
          'post',
        );

        setUserForm(initialUser);
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Đăng ký nhân viên thành công!!!',
          visibilityTime: 10000,
        });
        navigation.goBack();
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Thất bại',
          text2: error.message,
          visibilityTime: 10000,
        });
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ContainerComponent back isScroll title="Thêm mới nhân viên">
      <SpaceComponent height={10} />
      <DividerComponent />
      <SpaceComponent height={10} />
      <SectionComponent>
        {Object.keys(userForm).map(key => (
          <View key={key}>
            {errors[key] ? (
              <TextComponent text={errors[key]} color={appColors.red} />
            ) : null}
            <InputComponent
              value={userForm[`${key}`]}
              onChange={value => handleChangeValue(key, value)}
              placeholder={`Please enter your ${key}`}
              allowClear={
                key === 'password' || key === 'confirmPassword' ? false : true
              }
              isPassword={
                key === 'password' || key === 'confirmPassword' ? true : false
              }
              affix={icons[key]}
              type={key === 'phone' ? 'phone-pad' : 'default'}
            />
          </View>
        ))}
      </SectionComponent>

      <SectionComponent>
        <ButtonComponent
          onPress={handleRegister}
          type="primary"
          text="Đăng ký Thợ mới"
          styles={{
            backgroundColor: appColors.success,
          }}
        />
      </SectionComponent>

      <LoadingComponent visible={isLoading} />
    </ContainerComponent>
  );
};

export default AddNewUserScreen;
