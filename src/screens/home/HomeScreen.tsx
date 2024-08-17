import AsyncStorage from '@react-native-async-storage/async-storage';
import {Notification} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import Toast from 'react-native-toast-message';
import {HandleUserAPI} from '../../apis/handleUserAPI';
import {
  ContainerComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {appColors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {LoadingModal} from '../../modals';
import {UserModel} from '../../models/UserModel';
import {globalStyles} from '../../styles/globalStyle';

const HomeScreen = ({navigation}: any) => {
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<any>([]);
  // const [yAxisLabelWidth, setYAxisLabelWidth] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [stepValue, setStepValue] = useState(0);
  const [isDataReady, setIsDataReady] = useState(false);

  const [dataEarningAmount, setDataEarningAmount] = useState<any>([]);
  const [maxEarningAmount, setMaxEarningAmount] = useState(0);
  const [stepEarningAmount, setStepEarningAmount] = useState(0);
  const [isEarningAmountReady, setIsEarningAmountReady] = useState(false);

  const [dataEarningPaymentAmount, setDataEarningPaymentAmount] = useState<any>(
    [],
  );
  const [maxEarningPaymentAmount, setMaxEarningPaymentAmount] = useState(0);
  const [stepEarningPaymentAmount, setStepEarningPaymentAmount] = useState(0);
  const [isEarningPaymentAmountReady, setIsEarningPaymentAmountReady] =
    useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      getMonthlyEarningAmounts(userId);
      getMonthlyEarnings(userId);
      getMonthlyEarningPaymentAmounts(userId);
    }
  }, [userId]);

  const fetchUserData = async () => {
    setIsLoading(true);

    const user = await AsyncStorage.getItem('auth');

    if (user) {
      const parsedUser = JSON.parse(user);
      const api = `/info?id=${parsedUser.id}`;
      setUserId(parsedUser.id);
      try {
        const res = await HandleUserAPI.Info(api);
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Lấy thông tin người dùng thành công',
          visibilityTime: 1000,
        });
        setUserData(res.data);
      } catch (error) {
        // console.error('Lỗi khi lấy thông tin người dùng: ', error);
        Toast.show({
          type: 'error',
          text1: 'Thất bại',
          text2: 'Lấy thông tin người dùng thất bại',
          visibilityTime: 1000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // console.log(userId);
  const getMonthlyEarningAmounts = async (id: string) => {
    setIsLoading(true);
    const api = `/getMonthlyEarningAmounts?id=${id}`;
    try {
      const res = await HandleUserAPI.Info(api);
      setDataEarningAmount(res.data);

      // Tính toán maxValue và stepValue
      const max = Math.max(...res.data.map((item: any) => item.value));
      const step = Math.ceil(max / 5);

      setMaxEarningAmount(max);
      setStepEarningAmount(step);
      setIsEarningAmountReady(true); // Đánh dấu rằng dữ liệu đã sẵn sàng
    } catch (error) {
      // console.error('Lỗi khi lấy thông tin người dùng: ', error);
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Lấy thông tin người dùng thất bại',
        visibilityTime: 1000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const getMonthlyEarnings = async (id: string) => {
    setIsLoading(true);
    const api = `/getMonthlyEarnings?id=${id}`;

    try {
      const res = await HandleUserAPI.Info(api);
      setData(res.data);

      // Tính toán maxValue và stepValue
      const max = Math.max(...res.data.map((item: any) => item.value));
      const step = Math.ceil(max / 5);

      setMaxValue(max);
      setStepValue(step);
      setIsDataReady(true); // Đánh dấu rằng dữ liệu đã sẵn sàng
    } catch (error) {
      // console.error('Lỗi khi lấy thông tin người dùng: ', error);
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Lấy thông tin người dùng thất bại',
        visibilityTime: 1000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const getMonthlyEarningPaymentAmounts = async (id: string) => {
    setIsLoading(true);
    const api = `/getMonthlyEarningPaymentAmounts?id=${id}`;
    try {
      const res = await HandleUserAPI.Info(api);
      setDataEarningPaymentAmount(res.data);

      // Tính toán maxValue và stepValue
      const max = Math.max(...res.data.map((item: any) => item.value));
      const step = Math.ceil(max / 5);

      setMaxEarningPaymentAmount(max);
      setStepEarningPaymentAmount(step);
      setIsEarningPaymentAmountReady(true); // Đánh dấu rằng dữ liệu đã sẵn sàng
    } catch (error) {
      // console.error('Lỗi khi lấy thông tin người dùng: ', error);
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Lấy thông tin người dùng thất bại',
        visibilityTime: 1000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // // console.log(data);
  // const maxValue = Math.max(...data.map((item: any) => item.value));
  // const stepValue = Math.ceil(maxValue / 5);
  // console.log(dataEarningAmount);
  const calculateYAxisLabelWidth = () => {
    const maxLength = Math.max(
      ...data.map((item: any) => item.value.toString().length),
    );
    return maxLength * 10; // Điều chỉnh theo fontSize của nhãn trục y
  };
  const calculateYAxisLabelWidthAmount = () => {
    const maxLength = Math.max(
      ...dataEarningAmount.map((item: any) => item.value.toString().length),
    );
    return maxLength * 10; // Điều chỉnh theo fontSize của nhãn trục y
  };
  const calculateYAxisLabelWidthPaymentAmount = () => {
    const maxLength = Math.max(
      ...dataEarningPaymentAmount.map(
        (item: any) => item.value.toString().length,
      ),
    );
    return maxLength * 10; // Điều chỉnh theo fontSize của nhãn trục y
  };

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
        </RowComponent>
      </SectionComponent>
      <View style={[globalStyles.container]}>
        <SectionComponent>
          <TextComponent
            text="I. Thống kê doanh số đơn hàng"
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
          <TextComponent
            text="Thống kê"
            color={appColors.white}
            font={fontFamilies.bold}
          />
          <View style={{paddingVertical: 20, alignItems: 'center'}}>
            {isEarningAmountReady && (
              <BarChart
                data={dataEarningAmount}
                barWidth={22}
                spacing={20}
                barBorderRadius={4}
                showGradient
                yAxisLabelWidth={calculateYAxisLabelWidthAmount()}
                hideRules
                yAxisThickness={0}
                xAxisColor="#FFFFFF"
                yAxisTextStyle={{color: 'white'}}
                xAxisLabelTextStyle={{
                  color: 'white',
                  fontFamily: fontFamilies.regular,
                }}
                isAnimated
                labelWidth={30}
                rotateLabel={true}
                stepValue={stepEarningAmount}
                maxValue={maxEarningAmount}
              />
            )}
          </View>
        </View>

        <SectionComponent>
          <TextComponent
            text="II. Thống kê doanh số kiếm được"
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
          <TextComponent
            text="Thống kê"
            color={appColors.white}
            font={fontFamilies.bold}
          />
          <View style={{paddingVertical: 20, alignItems: 'center'}}>
            {isDataReady && (
              <BarChart
                data={data}
                barWidth={22}
                spacing={20}
                barBorderRadius={4}
                showGradient
                yAxisLabelWidth={calculateYAxisLabelWidth()}
                hideRules
                yAxisThickness={0}
                xAxisColor="#FFFFFF"
                yAxisTextStyle={{color: 'white'}}
                xAxisLabelTextStyle={{
                  color: 'white',
                  fontFamily: fontFamilies.regular,
                }}
                isAnimated
                labelWidth={30}
                rotateLabel={true}
                stepValue={stepValue}
                maxValue={maxValue}
              />
            )}
          </View>
        </View>
        <SectionComponent>
          <TextComponent
            text="III. Thống kê doanh số phải chi cho nhân công"
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
          <TextComponent
            text="Thống kê"
            color={appColors.white}
            font={fontFamilies.bold}
          />
          <View style={{paddingVertical: 20, alignItems: 'center'}}>
            {isEarningPaymentAmountReady && (
              <BarChart
                data={dataEarningPaymentAmount}
                barWidth={22}
                spacing={20}
                barBorderRadius={4}
                showGradient
                yAxisLabelWidth={calculateYAxisLabelWidthPaymentAmount()}
                hideRules
                yAxisThickness={0}
                xAxisColor="#FFFFFF"
                yAxisTextStyle={{color: 'white'}}
                xAxisLabelTextStyle={{
                  color: 'white',
                  fontFamily: fontFamilies.regular,
                }}
                isAnimated
                labelWidth={30}
                rotateLabel={true}
                stepValue={stepEarningPaymentAmount}
                maxValue={maxEarningPaymentAmount}
              />
            )}
          </View>
        </View>
      </View>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default HomeScreen;
