import {View, Text, Modal, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../styles/globalStyle';
import {CloseCircle} from 'iconsax-react-native';
import {appColors} from '../constants/colors';
import {
  InputComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../components';
import ButtonComponent from '../components/ButtonComponent';
import {fontFamilies} from '../constants/fontFamilies';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HandleUserAPI} from '../apis/handleUserAPI';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  name?: string | null;
  phone?: string | null;
  userId: string;
  onUpdate: () => void;
}

const EditAccountModal = (props: Props) => {
  const {onClose, visible, title, name, phone, onUpdate, userId} = props;
  const [editName, setEditName] = useState(name);
  const [editPhone, setEditPhone] = useState(phone);
  const [errorName, setErrorName] = useState('');
  const [errorPhone, setErrorPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEditName(name);
    setEditPhone(phone);
  }, [name, phone]);

  useEffect(() => {
    if (editName && editName.length < 3) {
      setErrorName('Số ký tự phải lớn hơn 3');
    } else {
      setErrorName('');
    }
    if (editPhone && (editPhone.length < 9 || editPhone.length > 12)) {
      setErrorPhone('Số điện thoại phải là 10 hoặc 11 số');
    } else {
      setErrorPhone('');
    }
  }, [editName, editPhone]);

  const handleEditAccount = async (userId: string) => {
    if (editName === '') {
      setErrorName('Không được để trống');
      return;
    }
    setErrorName('');
    if (editPhone === '') {
      setErrorPhone('Không được để trống');
      return;
    }
    setErrorPhone('');

    setIsLoading(true);
    try {
      if (userId) {
        const api = `/editInfoUser?id=${userId}`;
        try {
          await HandleUserAPI.Info(
            api,
            {name: editName, phone: editPhone},
            'put',
          );
        } catch (error) {
          console.error('Lỗi chỉnh sửa thông tin người dùng: ', error);
        }

        onUpdate();
        onClose();
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Cập nhật thành công!!!',
          visibilityTime: 1000,
        });
      }
    } catch (error: any) {
      console.error('Error updating user data: ', error);
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: error.message,
        visibilityTime: 1000,
      });
    } finally {
      setIsLoading(false);
    }
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
              text={title ? title : 'Chỉnh Sửa'}
              size={20}
              font={fontFamilies.bold}
            />
            <TouchableOpacity onPress={() => onClose()}>
              <CloseCircle size={22} color={appColors.gray} />
            </TouchableOpacity>
          </RowComponent>
          <SpaceComponent height={20} />
          <TextComponent text="Họ và tên" />
          <SpaceComponent height={10} />
          {errorName && (
            <>
              <TextComponent text={errorName} color={appColors.red} />
              <SpaceComponent height={5} />
            </>
          )}
          <InputComponent
            value={editName ?? ''}
            onChange={val => setEditName(val)}
          />
          <TextComponent text="Số điện thoại" />
          <SpaceComponent height={10} />
          {errorPhone && (
            <>
              <TextComponent text={errorPhone} color={appColors.red} />
              <SpaceComponent height={5} />
            </>
          )}
          <InputComponent
            value={editPhone ?? ''}
            onChange={val => setEditPhone(val)}
            type="phone-pad"
          />
          <ButtonComponent
            isLoading={isLoading}
            text="Cập nhật thông tin"
            type="primary"
            color={appColors.edit}
            onPress={() => handleEditAccount(userId)}
          />
        </View>
      </View>
    </Modal>
  );
};

export default EditAccountModal;
