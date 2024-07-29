import {View, Text, StyleProp, ViewStyle, TouchableOpacity} from 'react-native';
import React, {ReactNode} from 'react';
import {globalStyles} from '../styles/globalStyle';
import {appColors} from '../constants/colors';

interface Props {
  children?: ReactNode;
  onPress?: () => void;
  styles?: StyleProp<ViewStyle>;
  color?: string;
}

const CardComponent = (props: Props) => {
  const {children, onPress, styles, color} = props;
  const localStyles: StyleProp<ViewStyle> = {
    paddingVertical: 12,
    marginBottom: 20,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    backgroundColor: color ?? appColors.white,
    borderRadius: 4,
  };
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      disabled={!onPress}
      style={[localStyles, globalStyles.shadow, styles]}>
      {children}
    </TouchableOpacity>
  );
};

export default CardComponent;
