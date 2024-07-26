import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeNavigator from './HomeNavigator';
import {ScheduleScreen, StaffScreen, WorkScreen} from '../../screens';
import ProfileScreen from '../../screens/profile/ProfileScreen';
import {appColors} from '../../constants/colors';
import {
  Calendar,
  Home,
  Profile2User,
  ProfileCircle,
} from 'iconsax-react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {UserModel} from '../../models/UserModel';

const TabsNavigators = () => {
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const Tabs = createBottomTabNavigator();

  useEffect(() => {
    fetchUserData();
    handleCheckUserAdmin();
  }, []);

  const fetchUserData = async () => {
    const user = auth().currentUser;
    if (user) {
      try {
        const userDoc: any = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    }
  };

  const handleCheckUserAdmin = () => {
    if (userData) {
      const admin = userData.role;
      // console.log(typeof admin);
      setIsAdmin(admin === 'admin' ? true : false);
    }
  };

  const renderMenuAdmin = isAdmin ? (
    <>
      <Tabs.Screen name="HomeTab" component={HomeNavigator}></Tabs.Screen>
      <Tabs.Screen name="StaffTab" component={StaffScreen}></Tabs.Screen>
      <Tabs.Screen name="WorkTab" component={WorkScreen}></Tabs.Screen>
      <Tabs.Screen name="ScheduleTab" component={ScheduleScreen}></Tabs.Screen>
      <Tabs.Screen name="ProfileTab" component={ProfileScreen}></Tabs.Screen>
    </>
  ) : (
    <>
      <Tabs.Screen name="HomeTab" component={HomeNavigator}></Tabs.Screen>
      <Tabs.Screen name="WorkTab" component={WorkScreen}></Tabs.Screen>
      <Tabs.Screen name="ProfileTab" component={ProfileScreen}></Tabs.Screen>
    </>
  );

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
      {renderMenuAdmin}
    </Tabs.Navigator>
  );
};

export default TabsNavigators;
