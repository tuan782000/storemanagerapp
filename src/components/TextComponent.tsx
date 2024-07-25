import {View, Text, StyleProp} from 'react-native';
import React from 'react';
import {TextStyle} from 'react-native';
import {appColors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';
import {globalStyles} from '../styles/globalStyle';
// thêm tilte để khác kiểu

interface Props {
  text: string;
  color?: string;
  size?: number;
  flex?: number;
  font?: string;
  styles?: StyleProp<TextStyle>;
  title?: boolean;
}
const TextComponent = (props: Props) => {
  const {text, color, flex, font, size, styles, title} = props;
  return (
    <Text
      style={[
        globalStyles.text,
        {
          color: color ?? appColors.text,
          flex: flex ?? 0,
          fontSize: size ? size : title ? 24 : 14,
          // fontSize: size,
          fontFamily: font
            ? font
            : title
            ? fontFamilies.medium
            : fontFamilies.regular,
        },
        styles,
      ]}>
      {text}
    </Text>
  );
};

export default TextComponent;
