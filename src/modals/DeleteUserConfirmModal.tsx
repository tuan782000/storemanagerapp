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
import ButtonComponent from '../components/ButtonComponent';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {HandleUserAPI} from '../apis/handleUserAPI';

interface Props {
  visible: boolean;
  onClose: () => void;
  userId: string;
  title?: string;
}

const DeleteUserConfirmModal = (props: Props) => {
  const {onClose, visible, title, userId} = props;
  const navigation = useNavigation();

  const handleDeleteStaff = async (id: string) => {
    try {
      const api = `/deleteEmployee?id=${id}`;
      await HandleUserAPI.Info(api, undefined, 'delete');
      handleOnCloseModal();
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Xoá nhân viên thành công!!!',
        visibilityTime: 1000,
      });
      navigation.goBack(); // Nếu sử dụng react-navigation
    } catch (error: any) {
      console.error('Error deleting user: ', error);
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: error.message,
        visibilityTime: 1000,
      });
    }
  };

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
              text={title ? title : 'Xoá nhân viên'}
              size={20}
              font={fontFamilies.bold}
            />
            <TouchableOpacity onPress={handleOnCloseModal}>
              <CloseCircle size={22} color={appColors.gray} />
            </TouchableOpacity>
          </RowComponent>
          <SpaceComponent height={5} />
          <TextComponent text="Bạn có chắc muốn xoá nhân viên?" />
          <SpaceComponent height={5} />
          <TextComponent text="Mã nhân viên" />
          <SpaceComponent height={5} />
          <InputComponent
            value={`${userId}`}
            onChange={() => {}}
            disabled={false}
            styleInput={{backgroundColor: appColors.disabled}}
          />
          {/* <SpaceComponent height={20} /> */}
          <RowComponent justify="flex-end">
            <ButtonComponent
              text="Huỷ"
              type="primary"
              color={appColors.red}
              styles={{paddingHorizontal: 30}}
              onPress={handleOnCloseModal}
            />
            <SpaceComponent width={10} />

            <ButtonComponent
              text="Đồng ý"
              type="primary"
              color={appColors.success}
              onPress={() => handleDeleteStaff(userId)}
            />
          </RowComponent>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteUserConfirmModal;
