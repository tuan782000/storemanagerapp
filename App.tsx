import {View, Text, StatusBar} from 'react-native';
import React from 'react';
import {fontFamilies} from './src/constants/fontFamilies';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Routers from './src/routes/Routers';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
} from 'react-native-toast-message';
import {appColors} from './src/constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Host} from 'react-native-portalize';
import {Provider} from 'react-redux';
import store from './src/redux/store';

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: appColors.success,
        borderLeftWidth: 0,
      }}
      renderLeadingIcon={() => (
        <Ionicons
          name="checkmark-circle-outline"
          color={appColors.white}
          size={20}
        />
      )}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        color: appColors.white,
      }}
      text2Style={{
        fontSize: 15,
        fontFamily: fontFamilies.medium,
        color: appColors.white,
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      contentContainerStyle={{
        backgroundColor: appColors.red,
        borderLeftWidth: 0,
        borderLeftColor: appColors.red,
      }}
      text1Style={{
        fontSize: 17,
        color: appColors.white,
      }}
      text2Style={{
        fontSize: 15,
        color: appColors.white,
      }}
    />
  ),

  info: (props: any) => (
    <InfoToast
      {...props}
      contentContainerStyle={{
        backgroundColor: appColors.primary,
        borderLeftWidth: 0,
        borderLeftColor: appColors.primary,
      }}
      text1Style={{
        fontSize: 17,
        color: appColors.white,
      }}
      text2Style={{
        fontSize: 15,
        color: appColors.white,
      }}
    />
  ),

  tomatoToast: ({text1, props}: any) => (
    <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};

const App = () => {
  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <Host>
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
            translucent
          />
          <Provider store={store}>
            <Routers />
          </Provider>
          <Toast config={toastConfig} />
        </Host>
      </GestureHandlerRootView>
    </>
  );
};

export default App;
