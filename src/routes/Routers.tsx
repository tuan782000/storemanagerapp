import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SplashScreen} from '../screens';
import MainNavigator from './navigators/MainNavigator';
import AuthNavigator from './navigators/AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';

const Routers = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [accessToken, setAccessToken] = useState('');
  // lấy và gán vào trong asyncStore của cái phone accessToken dựa vào useAsyncStorage
  const {getItem, setItem} = useAsyncStorage('keyAccessToken');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    handleCheckLogin();
  }, []);

  const handleCheckLogin = async () => {
    const token = await getItem();
    console.log(token);

    if (token) {
      token && setAccessToken(token);
    }
  };

  return isShowSplash ? (
    <SplashScreen />
  ) : (
    <NavigationContainer>
      {accessToken ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default Routers;
