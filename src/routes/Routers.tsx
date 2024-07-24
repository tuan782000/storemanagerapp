import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SplashScreen} from '../screens';
import MainNavigator from './navigators/MainNavigator';
import AuthNavigator from './navigators/AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';

const Routers = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return isShowSplash ? (
    <SplashScreen />
  ) : (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
};

export default Routers;
