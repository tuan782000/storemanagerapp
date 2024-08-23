import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../../screens';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import Dashboard from '../../screens/home/Dashboard';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  const auth = useSelector(authSelector);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Home"
        component={auth && auth.role === 'admin' ? Dashboard : HomeScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
