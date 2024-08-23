import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SplashScreen} from '../screens';
import MainNavigator from './navigators/MainNavigator';
import AuthNavigator from './navigators/AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {addAuth, authSelector} from '../redux/reducers/authReducer';
import {useDispatch, useSelector} from 'react-redux';

const Routers = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);

  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const {getItem} = useAsyncStorage('auth');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const res = await getItem();
    res && dispatch(addAuth(JSON.parse(res)));
  };

  return isShowSplash ? (
    <SplashScreen />
  ) : (
    <NavigationContainer>
      {auth.accesstoken ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default Routers;
