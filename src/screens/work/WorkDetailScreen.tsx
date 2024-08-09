import {View, Text} from 'react-native';
import React from 'react';
import {TextComponent} from '../../components';

const WorkDetailScreen = ({navigation, route}: any) => {
  const {id} = route.params;

  return (
    <View>
      <Text>WorkDetailScreen</Text>
      <TextComponent text={id} />
    </View>
  );
};

export default WorkDetailScreen;
