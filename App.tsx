import {View, Text, StatusBar} from 'react-native';
import React from 'react';
import {fontFamilies} from './src/constants/fontFamilies';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Routers from './src/routes/Routers';

const App = () => {
  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent
      />
      <Routers />
    </>
  );
};

export default App;
