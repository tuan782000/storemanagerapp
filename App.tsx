import {View, Text} from 'react-native';
import React from 'react';
import {fontFamilies} from './src/constants/fontFamilies';
import AntDesign from 'react-native-vector-icons/AntDesign';

const App = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontFamily: fontFamilies.regular, fontSize: 20}}>App</Text>
    </View>
  );
};

export default App;
