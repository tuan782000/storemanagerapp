import {View, Text, Button, Touchable, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../../styles/globalStyle';
import {TextComponent} from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {UserModel} from '../../models/UserModel';
import {Logout} from 'iconsax-react-native';

const HomeScreen = ({navigation}: any) => {
  const [userData, setUserData] = useState<UserModel | null>(null);

  useEffect(() => {
    fetchUserData();
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

  const handleSignOut = async () => {
    await auth().signOut();

    // navigation.navigate('LoginScreen');
  };

  const user = auth().currentUser;
  return (
    <View style={[globalStyles.container, globalStyles.center]}>
      <TextComponent text={`${user?.email}`} />
      {userData ? (
        <>
          <TextComponent text={`Username: ${userData.username}`} />
        </>
      ) : (
        <></>
      )}
      <TouchableOpacity onPress={handleSignOut}>
        <Logout size={22} color="coral" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
