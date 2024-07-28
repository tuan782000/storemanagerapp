import {View, Text, Modal, ActivityIndicator} from 'react-native';
import React from 'react';
import {globalStyles} from '../styles/globalStyle';
import {appColors} from '../constants/colors';
import TextComponent from './TextComponent';
interface Props {
  message?: string;
  visible: boolean;
}

const LoadingComponent = (props: Props) => {
  const {visible, message} = props;
  return (
    <Modal
      animationType="slide"
      visible={visible}
      style={[globalStyles.center, {flex: 1}]}
      transparent
      statusBarTranslucent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator color={appColors.white} />
        {message && <TextComponent text={message} />}
      </View>
    </Modal>
  );
};

export default LoadingComponent;
