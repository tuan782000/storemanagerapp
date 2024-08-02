import {View, Text, Button, Image, Switch} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {UserModel, UserRole} from '../../models/UserModel';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {extractUsernameFromEmail} from '../../utils/extractUsernameFromEmail';
import {ResetPasswordModal} from '../../modals';
import Toast from 'react-native-toast-message';

const initialValue = {
  email: '',
  password: '',
  username: '',
  role: UserRole.Employee,
  name: '',
  phone: '',
  profilePicture: '',
  created_at: Date.now(),
  updated_at: Date.now(),
};

const initialErrors = {
  email: '',
  password: '',
};

const LoginScreen = ({navigation}: any) => {
  // binding dữ liệu 2 chiều - chiều 1 emai; xuống value - chiều thứ 2 từ onChange đến email
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  const [values, setValues] = useState<UserModel>(initialValue);
  const [errors, setErrors] = useState(initialErrors);
  const [errorFromFirebase, setErrorFromFirebase] = useState('');
  const [isRemember, setIsRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [isVisibledResetPassword, setIsVisibledResetPassword] = useState(false);

  // useEffect(() => {
  //   setErrors(initialErrors);
  // }, [values.email, values.password]);

  const handleChangeValue = (key: string, value: string) => {
    const data: any = {...values}; // copy toàn bộ value

    data[`${key}`] = value; // data[email] = t@gmail.com - key được truyền vào và value được truyền vào
    // lúc này data đã được chỉnh sửa

    setValues(data);
    setErrorFromFirebase('');
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

  const handleLoginWithEmail = async () => {
    if (values.email === '' || values.password === '') {
      // let newErrors = {...errors};
      // newErrors.email = 'Vui lòng kiểm tra lại email hoặc mật khẩu không đúng';
      // setErrors(newErrors);
      setErrorFromFirebase(
        'Vui lòng kiểm tra lại email hoặc mật khẩu không đúng',
      );
      return;
    }
    // Check for errors before submitting
    if (Object.values(errors).some(error => error !== '')) {
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Có lỗi trong form',
        visibilityTime: 10000,
      });
      return;
    }

    setIsLoading(true);

    if (values.email !== '' && values.password !== '') {
      setErrors(initialErrors);
      console.log(values);

      try {
        const userCredential = await auth().signInWithEmailAndPassword(
          values.email,
          values.password,
        );
        const user = userCredential.user;
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Đăng nhập thành công!!!',
          visibilityTime: 1000,
        });
        console.log(user);
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Thất bại',
          text2: error.message,
          visibilityTime: 1000,
        });
        setErrorFromFirebase(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // // Để tạm thời sau này sẽ làm đăng ký riêng cho admin
  // const handleRegister = async () => {
  //   if (values.email === '' || values.password === '') {
  //     // let newErrors = {...errors};
  //     // newErrors.email = 'Vui lòng kiểm tra lại email hoặc mật khẩu không đúng';
  //     // setErrors(newErrors);
  //     setErrorFromFirebase(
  //       'Vui lòng kiểm tra lại email hoặc mật khẩu không đúng',
  //     );
  //     return;
  //   }

  //   // Check for errors before submitting
  //   if (Object.values(errors).some(error => error !== '')) {
  //     console.log('There are errors in the form'); // thay chỗ này bằng toast
  //     return;
  //   }

  //   setIsLoading(true);

  //   if (values.email !== '' && values.password !== '') {
  //     setErrors(initialErrors);

  //     console.log(values);
  //     // await auth()
  //     //   .createUserWithEmailAndPassword(values.email, values.password)
  //     //   .then(userCredential => {
  //     //     const user = userCredential.user;

  //     //     // save user to firestore

  //     //     setIsLoading(false);
  //     //   })
  //     //   .catch((error: any) => {
  //     //     setIsLoading(false);
  //     //     console.log(error.message);
  //     //   });
  //     try {
  //       const userCredential = await auth().createUserWithEmailAndPassword(
  //         values.email,
  //         values.password,
  //       );
  //       const user = userCredential.user;

  //       // Save user data to Firestore
  //       await firestore()
  //         .collection('users')
  //         .doc(user.uid)
  //         .set({
  //           email: values.email,
  //           username: extractUsernameFromEmail(values.email),
  //           role: values.role,
  //           name: values.name,
  //           phone: values.phone,
  //           created_at: values.created_at,
  //           updated_at: values.updated_at,
  //         });

  //       console.log('User registered successfully:', values);
  //       console.log('User registered successfully - 01:', user);
  //     } catch (error: any) {
  //       console.log(error.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };

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
        {errorFromFirebase ? (
          <>
            <TextComponent text={errorFromFirebase} color={appColors.red} />
            <SpaceComponent height={5} />
          </>
        ) : null}
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
            onPress={() => setIsVisibledResetPassword(true)}
          />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent>
        <ButtonComponent
          isLoading={isLoading}
          text="ĐĂNG NHẬP"
          type="primary"
          onPress={handleLoginWithEmail}
          // onPress={handleRegister}
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

      <ResetPasswordModal
        onClose={() => setIsVisibledResetPassword(!isVisibledResetPassword)}
        visible={isVisibledResetPassword}
      />
    </ContainerComponent>
  );
};

export default LoginScreen;
