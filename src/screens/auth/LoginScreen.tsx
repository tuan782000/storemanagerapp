import {colors, Row, Section} from '@bsdaoquang/rncomponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Lock, Sms} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {handleAuthAPI} from '../../apis/authAPI';
import {InputComponent, SpaceComponent, TextComponent} from '../../components';
import ButtonComponent from '../../components/ButtonComponent';
import Container from '../../components/Container';
import {appColors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {LoadingModal, ResetModal} from '../../modals';
import {UserModel, UserRole} from '../../models/UserModel';
import {addAuth} from '../../redux/reducers/authReducer';
import {HandleAPI} from '../../apis/handleAPI';

const initialValue = {
  username: '',
  password: '',
};

const LoginScreen = ({navigation}: any) => {
  const [values, setValues] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const [isVisibledResetPassword, setIsVisibledResetPassword] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setErrorText('');
  }, [values]);

  const handleChangeValue = (key: string, value: string) => {
    const data: any = {...values};
    data[`${key}`] = value;

    setValues(data);
  };

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const res = await HandleAPI('/auth/login', values, 'post');
      await AsyncStorage.setItem('auth', JSON.stringify(res.data));
      dispatch(addAuth(res.data));
    } catch (error: any) {
      setErrorText(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container isScroll isFlex>
      <Section styles={{flex: 1, justifyContent: 'center'}}>
        <TextComponent text="Đăng nhập" size={20} font={fontFamilies.medium} />
        <SpaceComponent height={20} />

        <InputComponent
          onChange={val => handleChangeValue('username', val)}
          value={values.username}
          placeholder="Tên đăng nhập"
          allowClear
          affix={<Sms size={22} color={appColors.gray} />}
        />

        <InputComponent
          onChange={val => handleChangeValue('password', val)}
          value={values.password}
          placeholder="Mật khẩu"
          isPassword
          affix={<Lock size={22} color={appColors.gray} />}
        />

        <Row justifyContent="flex-end">
          <ButtonComponent
            text="Quên mật khẩu"
            type="link"
            onPress={() => {
              setIsVisibledResetPassword(true);
            }}
          />
        </Row>

        {errorText && (
          <TextComponent
            styles={{marginTop: 12}}
            size={12}
            text={errorText}
            color={colors.red600}
          />
        )}
        <SpaceComponent height={22} />
        <ButtonComponent
          isLoading={isLoading}
          text="ĐĂNG NHẬP"
          disable={!values.username || !values.password}
          type="primary"
          onPress={handleLogin}
        />
      </Section>

      <ResetModal
        onClose={() => setIsVisibledResetPassword(!isVisibledResetPassword)}
        visible={isVisibledResetPassword}
      />
      <LoadingModal visible={isLoading} />
    </Container>
  );
};

export default LoginScreen;
