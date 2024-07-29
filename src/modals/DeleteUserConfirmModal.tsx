import {View, Text, Modal} from 'react-native';
import React from 'react';
import {globalStyles} from '../styles/globalStyle';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
}

const DeleteUserConfirmModal = (props: Props) => {
  const {onClose, visible, title} = props;
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
            backgroundColor: 'white',
          }}></View>
      </View>
    </Modal>
  );
};

export default DeleteUserConfirmModal;
