import {View, Text, Modal, TouchableOpacity} from 'react-native';
import React from 'react';
import {globalStyles} from '../styles/globalStyle';
import {
  InputComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../components';
import {fontFamilies} from '../constants/fontFamilies';
import {CloseCircle} from 'iconsax-react-native';
import {appColors} from '../constants/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
}

const AddUrlModal = (props: Props) => {
  const {onClose, visible, title} = props;
  const handleOnCloseModal = () => {
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
              text={title ? title : 'Địa chỉ URL'}
              size={20}
              font={fontFamilies.bold}
            />
            <TouchableOpacity onPress={handleOnCloseModal}>
              <CloseCircle size={22} color={appColors.gray} />
            </TouchableOpacity>
          </RowComponent>
          <SpaceComponent height={15} />
          {/* <InputComponent
            value={imageUrl}
            onChange={val => set}
            placeholder="URL"
          /> */}
        </View>
      </View>
    </Modal>
  );
};

export default AddUrlModal;
