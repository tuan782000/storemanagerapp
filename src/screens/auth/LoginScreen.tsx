import {View, Text, Button, Image, Switch} from 'react-native';
import React, {useState} from 'react';
import ButtonComponent from '../../components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {globalStyles} from '../../styles/globalStyle';
import {appColors} from '../../constants/colors';
import {
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {ArrowRight2, Lock, Sms} from 'iconsax-react-native';
import {fontFamilies} from '../../constants/fontFamilies';

const initialValue = {
  email: '',
  password: '',
};

const initialErrors = {
  email: '',
  password: '',
};

const LoginScreen = ({navigation}: any) => {
  // binding dữ liệu 2 chiều - chiều 1 emai; xuống value - chiều thứ 2 từ onChange đến email
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  const [values, setValues] = useState(initialValue);
  const [errors, setErrors] = useState(initialErrors);
  const [isRemember, setIsRemember] = useState(true);

  const handleChangeValue = (key: string, value: string) => {
    const data: any = {...values}; // copy toàn bộ value

    data[`${key}`] = value; // data[email] = t@gmail.com - key được truyền vào và value được truyền vào
    // lúc này data đã được chỉnh sửa

    setValues(data);
    validateInput(key, value);
  };

  const validateInput = (key: string, value: string) => {
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
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleLogin = async () => {
    // Check for errors before submitting
    if (Object.values(errors).some(error => error !== '')) {
      console.log('There are errors in the form'); // thay chỗ này bằng toast
      return;
    }

    console.log(values);
  };

  return (
    <ContainerComponent isScroll>
      <SectionComponent
        styles={[globalStyles.center, {marginTop: 75, marginBottom: 30}]}>
        <Image
          source={require('../../assets/images/icon-logo.png')}
          style={{width: 162, height: 114}}
          resizeMode="contain"
        />
        <SpaceComponent height={20} />
        <TextComponent
          text="Điện lạnh Việt Nam"
          size={28}
          font={fontFamilies.bold}
        />
      </SectionComponent>
      <SectionComponent>
        <TextComponent text="Đăng nhập" size={20} title />
        <SpaceComponent height={20} />
        {errors['email'] ? (
          <>
            <TextComponent text={errors['email']} color={appColors.red} />
            <SpaceComponent height={5} />
          </>
        ) : null}
        <InputComponent
          onChange={val => handleChangeValue('email', val)}
          value={values.email}
          placeholder="Vui lòng nhập email"
          allowClear
          affix={<Sms size={22} color={appColors.gray} />}
        />
        {errors['password'] ? (
          <>
            <TextComponent text={errors['password']} color={appColors.red} />
            <SpaceComponent height={5} />
          </>
        ) : null}
        <InputComponent
          onChange={val => handleChangeValue('password', val)}
          value={values.password}
          placeholder="Vui lòng nhập mật khẩu"
          isPassword
          affix={<Lock size={22} color={appColors.gray} />}
        />
        <RowComponent justify="space-between">
          <RowComponent
            justify="flex-start"
            onPress={() => setIsRemember(!isRemember)}>
            <Switch
              thumbColor={appColors.white}
              trackColor={{true: appColors.primary}}
              value={isRemember}
              onChange={() => setIsRemember(!isRemember)}
            />
            <TextComponent text="Ghi nhớ đăng nhập" />
          </RowComponent>
          <ButtonComponent
            text="Quên mật khẩu"
            type="text"
            onPress={() =>
              console.log('Liên hệ với Admin để cấp lại mật khẩu mới')
            }
          />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent>
        <ButtonComponent
          text="ĐĂNG NHẬP"
          type="primary"
          onPress={handleLogin}
          icon={<ArrowRight2 size={20} color={appColors.white} />}
          iconPostion="right"
        />
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent styles={[globalStyles.center]}>
        <TextComponent
          text={`Dĩ tín giao tình, khách nhớ thương, \n Hài lòng khách đến, bền chặt giao thương.`}
          styles={{textAlign: 'center'}}
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default LoginScreen;
