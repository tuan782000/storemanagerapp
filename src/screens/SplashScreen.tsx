import {View, Text, Image, ActivityIndicator} from 'react-native';
import React from 'react';
import {globalStyles} from '../styles/globalStyle';
import {appInfos} from '../constants/appInfos';
import SpaceComponent from '../components/SpaceComponent';
import {appColors} from '../constants/colors';
import {TextComponent} from '../components';

const SplashScreen = () => {
  return (
    <View style={[globalStyles.container, globalStyles.center]}>
      <Image
        source={require('../assets/images/icon-logo.png')}
        style={{width: appInfos.sizes.width * 80, resizeMode: 'contain'}}
      />
      <SpaceComponent height={20} />
      <ActivityIndicator color={appColors.gray} size={22} />
      <SpaceComponent height={20} />
      <TextComponent text="Vui lòng đợi trong giây lát..." />
    </View>
  );
};

export default SplashScreen;
