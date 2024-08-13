import {View, Text, Modal, Platform, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SelectModel} from '../models/SelectModel';
import RowComponent from './RowComponent';
import {globalStyles} from '../styles/globalStyle';
import TextComponent from './TextComponent';
import {appColors} from '../constants/colors';
import {ArrowDown2, TickCircle} from 'iconsax-react-native';
import ButtonComponent from './ButtonComponent';
import SpaceComponent from './SpaceComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
  items: SelectModel[];
  selected: string[];
  onSelect: (val: string[]) => void;
}

const DropDownPickerStatusComponent = (props: Props) => {
  const {items, selected, onSelect} = props;

  const [isVisible, setIsVisible] = useState(false);
  const [dataSelected, setDataSelected] = useState<string[]>([]);

  useEffect(() => {
    selected && setDataSelected(selected);
  }, []);

  const handleSelecteItem = (id: string) => {
    setDataSelected([id]);
  };

  const handleConfirmSelect = () => {
    // truyền qua cho cha
    onSelect(dataSelected);
    setIsVisible(false);
    setDataSelected([]);
  };

  // const handleRemoveItemSelected = (index: number) => {
  //   if (selected) {
  //     selected.splice(index, 1);

  //     onSelect(selected);
  //   }
  // };

  const renderSelectedItem = (id: string, index: number) => {
    const item = items.find(element => element.value === id);
    return (
      item && (
        <RowComponent
          // onPress={() => handleRemoveItemSelected(index)}
          key={id}
          styles={{
            padding: 5,
            paddingHorizontal: 10,
            borderWidth: 0.5,
            borderColor: appColors.gray,
            borderRadius: 10,
            backgroundColor: appColors.primary,
            alignItems: 'center',
          }}>
          <TextComponent
            text={
              item.label === 'assigned'
                ? 'Đang giao việc'
                : item.label === 'accepted'
                ? 'Đã chấp nhận'
                : item.label === 'pending'
                ? 'Đang xử lý'
                : item.label === 'rejected'
                ? 'Đã từ chối'
                : item.label === 'completed'
                ? 'Đã hoàn thành'
                : ''
            }
            flex={0}
            styles={{color: appColors.white}}
          />
          {/* <SpaceComponent width={10} />
          <AntDesign name="close" size={14} color={appColors.white} /> */}
        </RowComponent>
      )
    );
  };
  return (
    <View>
      <RowComponent
        onPress={() => {
          setIsVisible(true);
        }}
        styles={[
          globalStyles.inputContainer,
          {
            paddingVertical: 16,
          },
        ]}>
        <View style={{flex: 1, paddingRight: 12}}>
          {selected && selected.length > 0 ? (
            <RowComponent justify="flex-start" styles={{flexWrap: 'wrap'}}>
              {selected.map((id, index) => renderSelectedItem(id, index))}
            </RowComponent>
          ) : (
            <TextComponent
              text="Chọn trạng thái cho công việc"
              color={appColors.text}
              flex={0}
            />
          )}
        </View>
        <ArrowDown2 size={22} color={appColors.text} />
      </RowComponent>

      <Modal
        visible={isVisible}
        style={{flex: 1}}
        transparent
        animationType="slide"
        statusBarTranslucent>
        <View
          style={[
            globalStyles.container,
            {
              padding: 20,
              paddingTop: Platform.OS === 'ios' ? 60 : 30,
              paddingBottom: Platform.OS === 'ios' ? 60 : 30,
            },
          ]}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            style={{flex: 1}}
            data={items}
            renderItem={({item}) => (
              <RowComponent
                justify="space-between"
                onPress={() => handleSelecteItem(item.value)}
                key={item.value}
                styles={{paddingVertical: 16}}>
                <TextComponent
                  text={
                    item.label === 'assigned'
                      ? 'Đang giao việc'
                      : item.label === 'accepted'
                      ? 'Đã chấp nhận'
                      : item.label === 'pending'
                      ? 'Đang xử lý'
                      : item.label === 'rejected'
                      ? 'Đã từ chối'
                      : item.label === 'completed'
                      ? 'Đã hoàn thành'
                      : ''
                  }
                  size={16}
                  color={
                    dataSelected.includes(item.value)
                      ? appColors.primary
                      : appColors.text
                  }
                />
                {dataSelected.includes(item.value) && (
                  <TickCircle size={22} color={appColors.primary} />
                )}
              </RowComponent>
            )}
          />
          <ButtonComponent
            text="Xác nhận"
            type="primary"
            onPress={handleConfirmSelect}
          />
          <SpaceComponent height={20} />
          <ButtonComponent
            text="Huỷ"
            type="primary"
            onPress={() => {
              setIsVisible(false);
            }}
            styles={{backgroundColor: appColors.red}}
          />
        </View>
      </Modal>
    </View>
  );
};

export default DropDownPickerStatusComponent;
