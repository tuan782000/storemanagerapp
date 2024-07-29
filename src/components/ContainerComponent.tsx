import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {ReactNode} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../styles/globalStyle';
import {useNavigation} from '@react-navigation/native';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {ArrowLeft2} from 'iconsax-react-native';
import {appColors} from '../constants/colors';
import ButtonComponent from './ButtonComponent';
import {fontFamilies} from '../constants/fontFamilies';

interface Props {
  isImageBackground?: boolean;
  isScroll?: boolean;
  title?: string;
  children: ReactNode;
  back?: boolean;
}

const ContainerComponent = (props: Props) => {
  const {children, isImageBackground, isScroll, title, back} = props;
  const navigation: any = useNavigation();
  const headerComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          // paddingTop: 30
        }}>
        {(title || back) && (
          <RowComponent
            styles={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              minWidth: 48,
              minHeight: 48,
            }}>
            {back && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{marginRight: 12}}>
                <ArrowLeft2 size={24} color={appColors.text} />
              </TouchableOpacity>
            )}
            {title && (
              <TextComponent
                text={title}
                size={20}
                font={fontFamilies.bold}
                flex={1}
              />
            )}
          </RowComponent>
        )}
        {returnContainerScrollView}
      </View>
    );
  };
  const returnContainerScrollView = isScroll ? (
    <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={{flex: 1}}>{children}</View>
  );
  return isImageBackground ? (
    <ImageBackground
      // Bạn có thể truyền ảnh vào đây source
      style={{flex: 1}}
      imageStyle={{flex: 1}}>
      <SafeAreaView style={[globalStyles.container]}>
        {headerComponent()}
      </SafeAreaView>
    </ImageBackground>
  ) : (
    <SafeAreaView style={[globalStyles.container]}>
      {headerComponent()}
    </SafeAreaView>
  );
};

export default ContainerComponent;
