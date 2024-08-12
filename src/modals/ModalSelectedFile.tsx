import {View, Text, Platform, PermissionsAndroid} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Modalize} from 'react-native-modalize';
import ImageCropPicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {Portal} from 'react-native-portalize';
import {
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {appColors} from '../constants/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectedFile: (file: any) => void;
}

const ModalSelectedFile = (props: Props) => {
  const {visible, onClose, onSelectedFile} = props;
  const modalRef = useRef<Modalize>();

  //   console.log(onSelectedFile);

  useEffect(() => {
    if (visible) {
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [visible]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    }
  }, []);

  const handlePickerImage = async (target: 'camera' | 'library') => {
    if (target === 'camera') {
      //request permision
      ImageCropPicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
        useFrontCamera: false,
      })
        .then(async (image: ImageOrVideo) => {
          const file = {
            uri: image.path,
            name: 'image-' + image.modificationDate,
            type: image.mime,
            size: image.size,
          };

          onSelectedFile(file);
        })
        .catch(error => console.log('Lỗi', error.toString()));
    } else {
      ImageCropPicker.openPicker({
        mediaType: 'photo',
      })
        .then(async (image: ImageOrVideo) => {
          const file = {
            uri: image.path,
            name: 'image-' + image.modificationDate,
            type: image.mime,
            size: image.size,
          };

          onSelectedFile(file);
        })
        .catch(error => console.log('Lỗi', error.toString()));
    }
  };

  return (
    <Portal>
      <Modalize
        onClose={onClose}
        handlePosition="inside"
        adjustToContentHeight
        ref={modalRef}>
        <SectionComponent styles={{paddingVertical: 40}}>
          {/* <ListItem
          title="Chọn ảnh từ thư viện"
          onPress={() => handlePickerImage('library')}
          icon={<Ionicons name="images" color={colors.gray50} size={22} />}
        />
        <ListItem
          title="Chụp ảnh"
          onPress={() => handlePickerImage('camera')}
          icon={<Ionicons name="camera" color={colors.gray50} size={22} />}
        /> */}
          <RowComponent
            justify="space-between"
            onPress={() => handlePickerImage('library')}>
            <TextComponent text="Chọn ảnh từ thư viện" size={16} />
            <Ionicons name="images" color={appColors.primary} size={22} />
          </RowComponent>
          <SpaceComponent height={15} />
          <RowComponent
            justify="space-between"
            onPress={() => handlePickerImage('camera')}>
            <TextComponent text="Chọn ảnh từ máy ảnh" size={16} />
            <Ionicons name="camera" color={appColors.primary} size={22} />
          </RowComponent>
        </SectionComponent>
      </Modalize>
    </Portal>
  );
};

export default ModalSelectedFile;
