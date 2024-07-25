import {View, Text, StyleProp} from 'react-native';
import React, {ReactNode} from 'react';
import {ViewStyle} from 'react-native';
import {globalStyles} from '../styles/globalStyle';

interface Props {
  children: ReactNode;
  styles?: StyleProp<ViewStyle>;
}

const SectionComponent = (props: Props) => {
  const {children, styles} = props;
  return <View style={[globalStyles.section, {}, styles]}>{children}</View>;
};

export default SectionComponent;
