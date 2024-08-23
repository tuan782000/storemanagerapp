import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabsNavigators from './TabsNavigators';
import {
  AddNewCustomerScreen,
  AddNewScheduleScreen,
  AddNewUserScreen,
  AddNewWorkScreen,
  SearchScreen,
  StaffDetailScreen,
  WorkDetailScreen,
} from '../../screens';
import {Notifications} from '../../utils/handleNotifications';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    Notifications.CheckPermision();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Main" component={TabsNavigators} />
      <Stack.Screen name="AddNewUserScreen" component={AddNewUserScreen} />
      <Stack.Screen name="StaffDetailScreen" component={StaffDetailScreen} />
      <Stack.Screen name="AddNewWorkScreen" component={AddNewWorkScreen} />
      <Stack.Screen name="WorkDetailScreen" component={WorkDetailScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen
        name="AddNewScheduleScreen"
        component={AddNewScheduleScreen}
      />
      <Stack.Screen
        name="AddNewCustomerScreen"
        component={AddNewCustomerScreen}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
