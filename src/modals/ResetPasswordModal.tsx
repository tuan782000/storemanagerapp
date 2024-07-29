import {View, Text, Modal, TouchableOpacity} from 'react-native';
import React from 'react';
import {globalStyles} from '../styles/globalStyle';
import {RowComponent, SpaceComponent, TextComponent} from '../components';
import {fontFamilies} from '../constants/fontFamilies';
import {CloseCircle} from 'iconsax-react-native';
import {appColors} from '../constants/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  text?: string;
}

const ResetPasswordModal = (props: Props) => {
  const {onClose, visible, title, text} = props;
  const handleCloseModal = () => {
    console.log('Close');
    onClose();
  };
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
          }}>
          <RowComponent justify="space-between" styles={{alignItems: 'center'}}>
            <TextComponent
              text={title ? title : 'Thay đổi mật khẩu'}
              size={20}
              font={fontFamilies.bold}
            />
            <TouchableOpacity onPress={handleCloseModal}>
              <CloseCircle size={22} color={appColors.gray} />
            </TouchableOpacity>
          </RowComponent>
          <SpaceComponent height={20} />
          <TextComponent
            text={
              text ??
              'Vui lòng liên hệ với Admin hoặc đến trụ sở để được cung cấp lại mật khẩu mới !!!'
            }
          />
        </View>
      </View>
    </Modal>
  );
};

export default ResetPasswordModal;
