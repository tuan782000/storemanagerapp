import {
  View,
  Text,
  Button,
  Touchable,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../../styles/globalStyle';
import {
  ContainerComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {UserModel} from '../../models/UserModel';
import {Logout, Notification} from 'iconsax-react-native';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamilies} from '../../constants/fontFamilies';
import {appColors} from '../../constants/colors';
import {HandleUserAPI} from '../../apis/handleUserAPI';

const barChartData: any = [
  {
    value: 2500,
    frontColor: '#006DFF',
    gradientColor: '#009FFF',
    spacing: 6,
    label: 'Jan',
  },
  {value: 2400, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

  {
    value: 3500,
    frontColor: '#006DFF',
    gradientColor: '#009FFF',
    spacing: 6,
    label: 'Feb',
  },
  {value: 3000, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

  {
    value: 4500,
    frontColor: '#006DFF',
    gradientColor: '#009FFF',
    spacing: 6,
    label: 'Mar',
  },
  {value: 4000, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

  {
    value: 5200,
    frontColor: '#006DFF',
    gradientColor: '#009FFF',
    spacing: 6,
    label: 'Apr',
  },
  {value: 4900, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

  {
    value: 3000,
    frontColor: '#006DFF',
    gradientColor: '#009FFF',
    spacing: 6,
    label: 'May',
  },
  {value: 2800, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},
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
  // const [userId, setUserId] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const user = await AsyncStorage.getItem('auth');

    // const user = auth().currentUser;
    // if (user) {
    //   try {
    //     const userDoc: any = await firestore()
    //       .collection('users')
    //       .doc(user.uid)
    //       .get();
    //     if (userDoc.exists) {
    //       setUserData(userDoc.data());
    //     }
    //   } catch (error) {
    //     console.error('Error fetching user data: ', error);
    //   }
    // }
    if (user) {
      const parsedUser = JSON.parse(user);
      const api = `/info?id=${parsedUser.id}`;
      // setUserId(parsedUser.id);
      try {
        const res = await HandleUserAPI.Info(api);
        setUserData(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng: ', error);
      }
    }
  };

  // const handleSignOut = async () => {
  //   await auth().signOut();

  //   // navigation.navigate('LoginScreen');
  // };

  // const user = auth().currentUser;
  console.log(userData);
  return (
    <ContainerComponent isScroll>
      <SectionComponent styles={{marginTop: 10}}>
        <RowComponent justify="space-between">
          <View
            style={{
              borderRadius: 999,
              borderWidth: 1,
              borderColor: appColors.primary,
            }}>
            <Image
              source={
                userData?.profilePicture
                  ? {
                      uri: userData?.profilePicture,
                    }
                  : require('../../assets/images/icon-logo.png')
              }
              style={{width: 100, height: 100, borderRadius: 999}}
              resizeMode="cover"
            />
          </View>
          {userData ? (
            <RowComponent
              justify="flex-start"
              styles={{flexDirection: 'column', alignItems: 'flex-end'}}>
              <TextComponent text={`Xin chào, ${userData.name}`} />
              <SpaceComponent height={20} />
              <Notification size={22} color={appColors.text} />
            </RowComponent>
          ) : (
            <></>
          )}
          {/* <TouchableOpacity onPress={handleSignOut}>
          <Logout size={22} color="coral" />
        </TouchableOpacity> */}
        </RowComponent>
      </SectionComponent>
      <View style={[globalStyles.container]}>
        {/* <BarChart
          data={barChartData}
          barWidth={30}
          barBorderRadius={5}
          frontColor="blue"
          initialSpacing={10}
          spacing={20}
          isAnimated
          animationDuration={1000}
          // animationType="SlideFromBottom"
        /> */}
        <SectionComponent>
          <TextComponent
            text="I. Thống kê doanh số thu - chi của 6 tháng gần nhất"
            size={18}
            font={fontFamilies.bold}
          />
        </SectionComponent>
        <View
          style={{
            margin: 10,
            padding: 16,
            borderRadius: 20,
            backgroundColor: '#232B5D',
          }}>
          <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
            Overview
          </Text>
          <View style={{padding: 20, alignItems: 'center'}}>
            <BarChart
              data={barChartData}
              barWidth={16}
              initialSpacing={10}
              spacing={14}
              barBorderRadius={4}
              showGradient
              yAxisThickness={0}
              xAxisType={'dashed'}
              xAxisColor={'lightgray'}
              yAxisTextStyle={{color: 'lightgray'}}
              stepValue={1000}
              maxValue={6000}
              noOfSections={6}
              yAxisLabelTexts={['0', '1k', '2k', '3k', '4k', '5k', '6k']}
              labelWidth={40}
              xAxisLabelTextStyle={{color: 'lightgray', textAlign: 'center'}}
              showLine
              lineConfig={{
                color: '#F29C6E',
                thickness: 3,
                curved: true,
                hideDataPoints: true,
                shiftY: 20,
                initialSpacing: -30,
              }}
            />
          </View>
        </View>
      </View>
      {/* <View style={[globalStyles.container, globalStyles.center]}>
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
      </View> */}

      <View style={[globalStyles.container, globalStyles.center]}>
        <SectionComponent>
          <TextComponent
            text="II. Tổng biên độ thu - chi của 6 tháng gần nhất"
            size={18}
            font={fontFamilies.bold}
          />
        </SectionComponent>
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
