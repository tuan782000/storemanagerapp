import {View, Text, Modal, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../styles/globalStyle';
import {
  InputComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../components';
import {fontFamilies} from '../constants/fontFamilies';
import {CloseCircle, Unlock} from 'iconsax-react-native';
import {appColors} from '../constants/colors';
import ButtonComponent from '../components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HandleUserAPI} from '../apis/handleUserAPI';
import Toast from 'react-native-toast-message';
import LoadingModal from './LoadingModal';

interface Props {
  visible: boolean;
  onClose: () => void;
  onUpdate: () => void;
  title?: string;
  text?: string;
}

const ResetPasswordModal = (props: Props) => {
  const {onClose, visible, title, text, onUpdate} = props;
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   validatePassword(password);
  // }, [password]);

  const handleChangeValue = (value: string) => {
    setPassword(value);
    validatePassword(value);
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setErrors('Mật khẩu phải có ít nhất 6 ký tự.');
    } else {
      setErrors('');
    }
  };

  const handleSubmitPassword = async () => {
    setIsLoading(true);
    const user = await AsyncStorage.getItem('auth');
    if (user) {
      const parsedUser = JSON.parse(user);
      const api = `/editPassword?id=${parsedUser.id}`;
      try {
        await HandleUserAPI.Info(
          api,
          {
            password,
          },
          'put',
        );

        onUpdate();
        onClose();
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Cập nhật thành công!!!',
          visibilityTime: 1000,
        });
      } catch (error) {
        // console.error('Lỗi chỉnh sửa mật khẩu: ', error);
        Toast.show({
          type: 'error',
          text1: 'Thất bại',
          text2: 'Lỗi chỉnh sửa mật khẩu: ',
          visibilityTime: 1000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <>
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
            <RowComponent
              justify="space-between"
              styles={{alignItems: 'center'}}>
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
            {errors && (
              <>
                <TextComponent
                  text={errors}
                  color={appColors.red}
                  styles={{}}
                />
                <SpaceComponent height={5} />
              </>
            )}
            <InputComponent
              onChange={val => handleChangeValue(val)}
              value={password}
              placeholder="Nhập mật khẩu mới"
              isPassword
              affix={<Unlock size={22} color={appColors.gray} />}
            />
            <ButtonComponent
              text="Thay đổi mật khẩu"
              type="primary"
              onPress={handleSubmitPassword}
            />
          </View>
        </View>
      </Modal>
      <LoadingModal visible={isLoading} />
    </>
  );
};

export default ResetPasswordModal;
