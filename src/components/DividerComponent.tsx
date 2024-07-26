import {View, Text} from 'react-native';
import React from 'react';
import {appColors} from '../constants/colors';

interface Props {}

const DividerComponent = (props: Props) => {
  const {} = props;
  return (
    <View
      style={{
        height: 1,
        backgroundColor: appColors.gray2,
        flex: 1,
      }}
    />
  );
};

export default DividerComponent;
