import {View, Text, Button, Touchable, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../../styles/globalStyle';
import {ContainerComponent, TextComponent} from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {UserModel} from '../../models/UserModel';
import {Logout} from 'iconsax-react-native';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import LinearGradient from 'react-native-linear-gradient';

const barChartData: any = [
  {value: 50, label: 'Jan'},
  {value: 80, label: 'Feb'},
  {value: 90, label: 'Mar'},
  {value: 70, label: 'Apr'},
  {value: 85, label: 'May'},
  {value: 60, label: 'Jun'},
];

const lineChartData: any = [
  {value: 50, label: 'Jan'},
  {value: 80, label: 'Feb'},
  {value: 90, label: 'Mar'},
  {value: 70, label: 'Apr'},
  {value: 85, label: 'May'},
  {value: 60, label: 'Jun'},
];

const pieData: any = [
  {value: 54, color: '#177AD5'},
  {value: 40, color: '#79D2DE'},
  {value: 20, color: '#ED6665'},
];

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
    <ContainerComponent isScroll>
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

      <View style={[globalStyles.container, globalStyles.center]}>
        <BarChart
          data={barChartData}
          barWidth={30}
          barBorderRadius={5}
          frontColor="blue"
          initialSpacing={10}
          spacing={20}
          isAnimated
          animationDuration={1000}
          // animationType="SlideFromBottom"
        />
      </View>
      <View style={[globalStyles.container, globalStyles.center]}>
        <LineChart
          data={lineChartData}
          thickness={2}
          startFillColor="#ffa726"
          endFillColor="#fb8c00"
          startOpacity={0.4}
          endOpacity={0.2}
          color="#ff7043"
          curved
          xAxisColor="black"
          yAxisColor="black"
          hideDataPoints
          isAnimated
          animationDuration={1000}
        />
        <LinearGradient colors={['#ffa726', '#fb8c00']} style={{flex: 1}} />
      </View>

      <View style={[globalStyles.container, globalStyles.center]}>
        <PieChart
          data={pieData}
          showText
          textColor="black"
          radius={150}
          textSize={20}
          focusOnPress
          showValuesAsLabels
          showTextBackground
          textBackgroundRadius={26}
        />
      </View>
    </ContainerComponent>
  );
};

export default HomeScreen;
