import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {globalStyles} from '../../styles/globalStyle';
import Swiper from 'react-native-swiper';
import {appInfos} from '../../constants/appInfos';
import {appColors} from '../../constants/colors';
import {ArrowLeft2, ArrowRight2} from 'iconsax-react-native';
import {fontFamilies} from '../../constants/fontFamilies';
import {TextComponent} from '../../components';

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
            paddingVertical: Platform.OS === 'ios' ? 50 : 40,
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
          <TextComponent
            text="Bỏ qua"
            color={appColors.primary}
            font={fontFamilies.bold}
          />
          <ArrowRight2 size={20} color={appColors.primary} />
        </TouchableOpacity>
      </View>
      <View
        style={[
          {
            paddingHorizontal: 16,
            paddingVertical: Platform.OS === 'ios' ? 30 : 22,
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
          {/* <TextComponent text="Quay lại" font={fontFamilies.medium} size={16} /> */}

          <TextComponent
            color={index === 0 ? appColors.gray2 : appColors.white}
            size={16}
            font={fontFamilies.medium}
            text="Quay lại"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() =>
            index < 2 ? setIndex(index + 1) : navigation.navigate('LoginScreen')
          }>
          <TextComponent
            color={appColors.white}
            size={16}
            font={fontFamilies.medium}
            text="Tiếp theo"
          />
          <ArrowRight2 size={18} color={appColors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;
