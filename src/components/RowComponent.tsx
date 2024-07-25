import {View, Text, TouchableOpacity} from 'react-native';
import React, {ReactNode} from 'react';
import {StyleProp} from 'react-native';
import {ViewStyle} from 'react-native';
import {globalStyles} from '../styles/globalStyle';

interface Props {
  onPress?: () => void;
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | undefined;
  styles?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const RowComponent = (props: Props) => {
  const {justify, styles, children, onPress} = props;
  const localStyles = [globalStyles.row, {justifyContent: justify}, styles];
  return onPress ? (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={localStyles}>
      {children}
    </TouchableOpacity>
  ) : (
    <View style={localStyles}>{children}</View>
  );
};

export default RowComponent;
