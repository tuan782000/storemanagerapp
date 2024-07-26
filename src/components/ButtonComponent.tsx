import {
  View,
  Text,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
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
  textFont?: string;
  isLoading?: boolean;
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
    textFont,
    isLoading,
  } = props;
  return type === 'primary' ? (
    <TouchableOpacity
      disabled={isLoading}
      onPress={onPress}
      style={[
        globalStyles.button,
        globalStyles.shadow,
        {
          backgroundColor: color ?? appColors.primary,
        },
        styles,
      ]}>
      {isLoading ? (
        <ActivityIndicator color={appColors.white} />
      ) : (
        <>
          {icon && iconPostion === 'left' && icon}
          <TextComponent
            text={text}
            color={textColor ?? appColors.white}
            font={textFont ?? fontFamilies.medium}
            styles={[
              textStyle,
              {
                marginLeft: icon ? 12 : 0,
                fontSize: 16,
                textAlign: 'center',
              },
            ]}
            flex={icon ? 1 : 0}
          />
          {icon && iconPostion === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={onPress}>
      <TextComponent
        text={text}
        color={type === 'link' ? appColors.link : appColors.text}
      />
    </TouchableOpacity>
  );
};

export default ButtonComponent;
