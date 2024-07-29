import {View, Text, StatusBar} from 'react-native';
import React from 'react';
import {fontFamilies} from './src/constants/fontFamilies';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Routers from './src/routes/Routers';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <>
        <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
          translucent
        />
        <Routers />
      </>
    </GestureHandlerRootView>
  );
};

export default App;
