import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeNavigator from './HomeNavigator';

const TabsNavigators = () => {
  const Tabs = createBottomTabNavigator();

  return (
    <Tabs.Navigator screenOptions={{headerShown: false}}>
      <Tabs.Screen name="HomeTab" component={HomeNavigator}></Tabs.Screen>
    </Tabs.Navigator>
  );
};

export default TabsNavigators;
