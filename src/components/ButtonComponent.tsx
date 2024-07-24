import {View, Text, ViewStyle, StyleProp, TouchableOpacity} from 'react-native';
import React, {ReactNode} from 'react';
import {TextStyle} from 'react-native';
import TextComponent from './TextComponent';

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
  return (
    <TouchableOpacity onPress={onPress}>
      {icon && iconPostion === 'left' && icon}
      <TextComponent text={text} color={textColor} styles={textStyle} />
      {icon && iconPostion === 'right' && icon}
    </TouchableOpacity>
  );
};

export default ButtonComponent;
