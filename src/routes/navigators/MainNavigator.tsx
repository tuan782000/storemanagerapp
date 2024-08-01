import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabsNavigators from './TabsNavigators';
import {
  AddNewCustomerScreen,
  AddNewUserScreen,
  AddNewWorkScreen,
  StaffDetailScreen,
} from '../../screens';

const MainNavigator = () => {
  // Auth thì nằm riêng
  // những cái nào bị che luôn bottomtab thì nằm trong Main
  // những nào nằm Tabs (5) Home - schedule - Staff - Customers - Info
  // Vì tabs có HomeScreen nên đặt ở main
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Main" component={TabsNavigators} />
      <Stack.Screen name="AddNewUserScreen" component={AddNewUserScreen} />
      <Stack.Screen name="AddNewWorkScreen" component={AddNewWorkScreen} />
      <Stack.Screen name="StaffDetailScreen" component={StaffDetailScreen} />
      <Stack.Screen
        name="AddNewCustomerScreen"
        component={AddNewCustomerScreen}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
