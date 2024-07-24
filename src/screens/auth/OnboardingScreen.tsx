import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {globalStyles} from '../../styles/globalStyle';
import Swiper from 'react-native-swiper';
import {appInfos} from '../../constants/appInfos';
import {appColors} from '../../constants/colors';
import {ArrowLeft2, ArrowRight2} from 'iconsax-react-native';
import {fontFamilies} from '../../constants/fontFamilies';

const OnboardingScreen = ({navigation}: any) => {
  const [index, setIndex] = useState(0);
  return (
    <View style={[globalStyles.container]}>
      <Swiper
        loop={false}
        activeDotColor={appColors.white}
        dotColor={appColors.gray}
        onIndexChanged={num => setIndex(num)}
        index={index}
        scrollEnabled={false}>
        <Image
          source={require('../../assets/images/onboarding_first.png')}
          style={{
            flex: 1,
            width: appInfos.sizes.width,
            height: appInfos.sizes.height,
            resizeMode: 'cover',
          }}
        />
        <Image
          source={require('../../assets/images/onboarding_second.png')}
          style={{
            flex: 1,
            width: appInfos.sizes.width,
            height: appInfos.sizes.height,
            resizeMode: 'cover',
          }}
        />
        <Image
          source={require('../../assets/images/onboarding_third.png')}
          style={{
            flex: 1,
            width: appInfos.sizes.width,
            height: appInfos.sizes.height,
            resizeMode: 'cover',
          }}
        />
      </Swiper>
      <View
        style={[
          {
            paddingHorizontal: 16,
            paddingVertical: 40,
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            justifyContent: 'center',
            alignItems: 'flex-end',
          },
        ]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('LoginScreen')}
          style={{
            flexDirection: 'row',
            backgroundColor: appColors.white,
            padding: 8,
            borderRadius: 8,
          }}>
          <Text
            style={{fontFamily: fontFamilies.bold, color: appColors.primary}}>
            Bỏ qua
          </Text>
          <ArrowRight2 size={20} color={appColors.primary} />
        </TouchableOpacity>
      </View>
      <View
        style={[
          {
            paddingHorizontal: 16,
            paddingVertical: 22,
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}>
        <TouchableOpacity
          disabled={index === 0 ? true : false}
          onPress={() => index > 0 && setIndex(index - 1)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <ArrowLeft2
            size={18}
            color={`${index === 0 ? appColors.gray2 : appColors.white}`}
          />
          <Text
            style={[
              styles.text,
              {color: index === 0 ? appColors.gray2 : appColors.white},
            ]}>
            Quay lại
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() =>
            index < 2 ? setIndex(index + 1) : navigation.navigate('LoginScreen')
          }>
          <Text style={[styles.text]}>Tiếp theo</Text>
          <ArrowRight2 size={18} color={appColors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  text: {
    color: appColors.white,
    fontSize: 16,
    fontFamily: fontFamilies.bold,
  },
});
