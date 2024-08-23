import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Calendar,
  Home,
  Profile2User,
  ProfileCircle,
} from 'iconsax-react-native';
import React from 'react';
import {View} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useSelector} from 'react-redux';
import {appColors} from '../../constants/colors';
import {authSelector} from '../../redux/reducers/authReducer';
import {ScheduleScreen, StaffScreen, WorkScreen} from '../../screens';
import ProfileScreen from '../../screens/profile/ProfileScreen';
import HomeNavigator from './HomeNavigator';

const TabsNavigators = () => {
  const Tabs = createBottomTabNavigator();

  const auth = useSelector(authSelector);

  return (
    <Tabs.Navigator
      screenOptions={({route}) => ({
        headerShown: false, // không show header
        tabBarShowLabel: false, // không show tên của bottom-tab
        tabBarIcon: ({focused, color, size}) => {
          (size = 24), (color = focused ? appColors.primary : appColors.gray2);
          let icon;
          switch (route.name) {
            case 'HomeTab':
              icon = <Home size={size} color={color} />;
              break;
            case 'ScheduleTab':
              icon = <Calendar size={size} color={color} />;
              break;
            case 'StaffTab':
              icon = <Profile2User size={size} color={color} />;
              break;
            case 'WorkTab':
              icon = (
                <FontAwesome6
                  name="screwdriver-wrench"
                  size={size}
                  color={color}
                />
              );
              break;
            case 'ProfileTab':
              icon = <ProfileCircle size={size} color={color} />;
              break;
          }
          return (
            <View style={{position: 'relative'}}>
              {focused ? (
                <View
                  style={{
                    position: 'absolute',
                    width: 22,
                    height: 2,
                    backgroundColor: color,
                    top: -15,
                  }}
                />
              ) : undefined}
              {icon}
            </View>
          );
        },
      })}>
      <Tabs.Screen name="HomeTab" component={HomeNavigator} />
      {auth && auth.role === 'admin' && (
        <>
          <Tabs.Screen name="StaffTab" component={StaffScreen} />
          <Tabs.Screen name="WorkTab" component={WorkScreen} />
        </>
      )}
      <Tabs.Screen name="ScheduleTab" component={ScheduleScreen} />
      <Tabs.Screen name="ProfileTab" component={ProfileScreen} />
    </Tabs.Navigator>
  );
};

export default TabsNavigators;
