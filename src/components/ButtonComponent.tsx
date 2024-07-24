import {View, Text, ViewStyle, StyleProp, TouchableOpacity} from 'react-native';
import React, {ReactNode} from 'react';
import {TextStyle} from 'react-native';
import TextComponent from './TextComponent';
import {globalStyles} from '../styles/globalStyle';
import {appColors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';

interface Props {
  text: string;
  icon?: ReactNode;
  type?: 'primary' | 'text' | 'link';
  color?: string;
  textColor?: string;
  styles?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  iconPostion?: 'right' | 'left';
}

// mặc định icon nằm bên trái

const ButtonComponent = (props: Props) => {
  const {
    text,
    icon,
    color,
    onPress,
    styles,
    textColor,
    textStyle,
    type,
    iconPostion,
  } = props;
  return type === 'primary' ? (
    <TouchableOpacity
      onPress={onPress}
      style={[
        globalStyles.button,
        {
          backgroundColor: color ?? appColors.primary,
        },
        styles,
      ]}>
      {icon && icon}
      <TextComponent
        text={text}
        color={textColor ?? appColors.white}
        font={fontFamilies.medium}
        styles={[
          textStyle,
          {
            marginLeft: icon ? 12 : 0,
          },
        ]}
        flex={icon && iconPostion === 'right' ? 1 : 0}
      />
      {icon && iconPostion === 'right' && icon}
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={onPress}>
      <TextComponent
        text="Ok"
        color={type === 'link' ? appColors.link : appColors.text}
      />
    </TouchableOpacity>
  );
};

export default ButtonComponent;
