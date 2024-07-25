import {View, Text, Button} from 'react-native';
import React, {useState} from 'react';
import ButtonComponent from '../../components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {globalStyles} from '../../styles/globalStyle';
import {appColors} from '../../constants/colors';
import {InputComponent} from '../../components';
import {Lock, Sms} from 'iconsax-react-native';

const LoginScreen = () => {
  // binding dữ liệu 2 chiều - chiều 1 emai; xuống value - chiều thứ 2 từ onChange đến email
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <View style={[globalStyles.container, globalStyles.center, {padding: 20}]}>
      {/* <ButtonComponent
        text="Login"
        type="primary"
        onPress={async () =>
          await AsyncStorage.setItem('keyAccessToken', 'TestAccessToken')
        }
      /> */}
      <InputComponent
        onChange={val => setEmail(val)}
        value={email}
        placeholder="Email"
        allowClear
        affix={<Sms size={22} color={appColors.gray} />}
      />
      <InputComponent
        onChange={val => setPassword(val)}
        value={password}
        placeholder="Password"
        isPassword
        affix={<Lock size={22} color={appColors.gray} />}
      />
    </View>
  );
};

export default LoginScreen;
