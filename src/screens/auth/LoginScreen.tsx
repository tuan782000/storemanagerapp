import {View, Text, Button} from 'react-native';
import React from 'react';
import ButtonComponent from '../../components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {globalStyles} from '../../styles/globalStyle';
import {appColors} from '../../constants/colors';

const LoginScreen = () => {
  return (
    <View style={[globalStyles.container, {padding: 16}]}>
      <Text>LoginScreen</Text>
      {/* <Button
        title="Login"
        onPress={async () =>
          await AsyncStorage.setItem('keyAccessToken', 'TestAccessToken')
        }
      /> */}
      <ButtonComponent
        text="Login"
        type="primary"
        onPress={async () =>
          await AsyncStorage.setItem('keyAccessToken', 'TestAccessToken')
        }
      />
    </View>
  );
};

export default LoginScreen;
