import {View, Text, Modal, ActivityIndicator} from 'react-native';
import React from 'react';
import {globalStyles} from '../styles/globalStyle';
import {SpaceComponent, TextComponent} from '../components';
import {appColors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';

interface Props {
  visible: boolean;
  title?: string;
}

const LoadingModal = (props: Props) => {
  const {visible, title} = props;
  return (
    <Modal
      visible={visible}
      style={[globalStyles.center, {flex: 1}]}
      transparent
      statusBarTranslucent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
        }}>
        <View
          style={{
            margin: 20,
            padding: 20,
            borderRadius: 12,
            // backgroundColor: 'white',
          }}>
          <ActivityIndicator color={appColors.white} size={32} />
          <SpaceComponent height={10} />
          <TextComponent
            text="Loading..."
            color={appColors.white}
            styles={{textAlign: 'center'}}
            font={fontFamilies.medium}
            size={16}
          />
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;
