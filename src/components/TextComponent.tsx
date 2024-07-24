import {View, Text} from 'react-native';
import React from 'react';
// thêm tilte để khác kiểu

interface Props {}
const TextComponent = (props: Props) => {
  const {} = props;
  return (
    <View>
      <Text>TextComponent</Text>
    </View>
  );
};

export default TextComponent;
