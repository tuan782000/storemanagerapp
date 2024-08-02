import {View, Text, Modal, TouchableOpacity} from 'react-native';
import React, {ReactNode, useRef, useState} from 'react';
import ButtonComponent from './ButtonComponent';
import {appColors} from '../constants/colors';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import TextComponent from './TextComponent';
import {Camera, CloseCircle, Image, Link} from 'iconsax-react-native';
import RowComponent from './RowComponent';
import SpaceComponent from './SpaceComponent';
import {fontFamilies} from '../constants/fontFamilies';
import ImageCropPicker, {
  ImageOrVideo,
  Options,
} from 'react-native-image-crop-picker';
import {AddUrlModal} from '../modals';
import {globalStyles} from '../styles/globalStyle';
import InputComponent from './InputComponent';

interface Props {
  onSelect: (val: {type: 'url' | 'file'; value: string | ImageOrVideo}) => void;
}

const ButtonImagePicker = (props: Props) => {
  const {onSelect} = props;
  const modalizeRef = useRef<Modalize>();
  const [imageUrl, setImageUrl] = useState('');
  const [isVisibleModalAddUrl, setisVisibleModalAddUrl] = useState(false);
  const options: Options = {
    cropping: true,
    mediaType: 'photo',
  };
  const choiceImages = [
    {
      key: 'cammera',
      title: 'Chụp ảnh',
      icon: <Camera size={22} color={appColors.text} />,
    },
    {
      key: 'library',
      title: 'Thư viên máy',
      icon: <Image size={22} color={appColors.text} />,
    },
    {
      key: 'url',
      title: 'Từ địa chỉ liên kết',
      icon: <Link size={22} color={appColors.text} />,
    },
  ];

  const handleChoiceImage = (key: string) => {
    switch (key) {
      case 'cammera':
        console.log('Lấy ảnh từ máy ảnh');
        ImageCropPicker.openCamera(options).then(res => {
          onSelect({type: 'file', value: res});
        });
        break;

      case 'library':
        console.log('Lấy ảnh từ thư viện');
        ImageCropPicker.openPicker(options).then(res => {
          onSelect({type: 'file', value: res});
        });
        break;

      case 'url':
        console.log('Lấy ảnh từ địa chỉ url');
        setisVisibleModalAddUrl(true);
        break;

      default:
        break;
    }

    modalizeRef.current?.close();
  };

  const renderItem = (item: {icon: ReactNode; key: string; title: string}) => (
    <RowComponent
      key={item.key}
      styles={{marginBottom: 20}}
      onPress={() => handleChoiceImage(item.key)}>
      {item.icon}
      <SpaceComponent width={12} />
      <TextComponent text={item.title} flex={1} font={fontFamilies.medium} />
    </RowComponent>
  );
  return (
    <View>
      <ButtonComponent
        text="Đổi ảnh đại diện"
        type="link"
        onPress={() => modalizeRef.current?.open()}
      />
      <Portal>
        <Modalize
          adjustToContentHeight
          ref={modalizeRef}
          handlePosition="inside">
          <View style={{marginVertical: 30, paddingHorizontal: 20}}>
            {choiceImages.map(item => renderItem(item))}
          </View>
        </Modalize>
      </Portal>
      {/* <AddUrlModal
        onClose={() => setisVisibleModalAddUrl(false)}
        visible={isVisibleModalAddUrl}
      /> */}
      <Modal
        visible={isVisibleModalAddUrl}
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
                text="Địa chỉ URL"
                size={20}
                font={fontFamilies.bold}
              />
              <TouchableOpacity onPress={() => setisVisibleModalAddUrl(false)}>
                <CloseCircle size={22} color={appColors.gray} />
              </TouchableOpacity>
            </RowComponent>
            <SpaceComponent height={15} />
            <InputComponent
              value={imageUrl}
              onChange={val => setImageUrl(val)}
              placeholder="URL"
              allowClear
            />
            <RowComponent justify="flex-end">
              <ButtonComponent
                type="primary"
                text="Đồng ý"
                onPress={() => {
                  setisVisibleModalAddUrl(false);
                  onSelect({type: 'url', value: imageUrl});
                }}
              />
            </RowComponent>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ButtonImagePicker;
