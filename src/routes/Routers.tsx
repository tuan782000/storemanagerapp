import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SplashScreen} from '../screens';
import MainNavigator from './navigators/MainNavigator';
import AuthNavigator from './navigators/AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

const Routers = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  // const [accessToken, setAccessToken] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  // lấy và gán vào trong asyncStore của cái phone accessToken dựa vào useAsyncStorage
  // const {getItem, setItem} = useAsyncStorage('keyAccessToken');

  // chạy từ trên xuống - những j của useEffect sẽ luôn chạy lần đầu tiên - nên sẽ được để qua 1 bên Build xong UI rồi quay lại chạy
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  // useEffect(() => {
  //   auth().onAuthStateChanged(user => {
  //     if (user) {
  //       setIsLogin(true);
  //     } else {
  //       setIsLogin(false);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   handleCheckLogin();
  // }, []);

  // const handleCheckLogin = async () => {
  //   const token = await getItem();
  //   console.log(token);

  //   if (token) {
  //     token && setAccessToken(token);
  //   }
  // };

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });
  }, []);

  return isShowSplash ? (
    <SplashScreen />
  ) : (
    <NavigationContainer>
      {/* {accessToken ? <MainNavigator /> : <AuthNavigator />} */}
      {isLogin ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default Routers;
