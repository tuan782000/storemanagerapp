import {View, Text, Button} from 'react-native';
import React from 'react';
import {globalStyles} from '../../styles/globalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  return (
    <View style={[globalStyles.container, globalStyles.center]}>
      <Text>HomeScreen</Text>
      <Button
        title="SignOut"
        onPress={async () => await AsyncStorage.clear()}
      />
    </View>
  );
};

export default HomeScreen;
