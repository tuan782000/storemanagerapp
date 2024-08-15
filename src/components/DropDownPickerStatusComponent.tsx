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
import {SelectStatusModel} from '../models/SelectStatusModel';
import {fontFamilies} from '../constants/fontFamilies';

interface Props {
  title?: string;
  items: SelectStatusModel[];
  selected: string; // selected là chuỗi
  onSelect: (val: string) => void; // onSelect nhận chuỗi
}

const DropDownPickerStatusComponent = (props: Props) => {
  const {items, selected, onSelect, title} = props;

  const [isVisible, setIsVisible] = useState(false);
  const [dataSelected, setDataSelected] = useState<string>(selected || '');

  useEffect(() => {
    selected && setDataSelected(selected);
  }, []);

  const handleSelecteItem = (id: string) => {
    setDataSelected(id); // Lưu trữ chỉ một giá trị chuỗi
  };

  const handleConfirmSelect = () => {
    onSelect(dataSelected); // Truyền chuỗi trạng thái
    setIsVisible(false);
  };

  const renderSelectedItem = (id: string) => {
    const item = items.find(element => element.value === id);
    return (
      item && (
        <RowComponent
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
              item.value === 'assigned'
                ? 'Đang giao việc'
                : item.value === 'accepted'
                ? 'Đã chấp nhận'
                : item.value === 'pending'
                ? 'Đang xử lý'
                : item.value === 'rejected'
                ? 'Đã từ chối'
                : item.value === 'completed'
                ? 'Đã hoàn thành'
                : ''
            }
            flex={0}
            styles={{color: appColors.white}}
          />
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
              {/* {selected.map((id, index) => renderSelectedItem(id, index))} */}
              {renderSelectedItem(selected)}
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
          {title && (
            <RowComponent
              justify="space-between"
              onPress={() => {
                setIsVisible(false);
              }}>
              <TextComponent text={title} font={fontFamilies.bold} size={20} />
              <View
                style={{
                  borderRadius: 999,
                  backgroundColor: appColors.red,
                  padding: 5,
                }}>
                <AntDesign name="close" size={22} color={appColors.white} />
              </View>
            </RowComponent>
          )}
          <SpaceComponent height={10} />
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
                    item.value === 'assigned'
                      ? 'Đang giao việc'
                      : item.value === 'accepted'
                      ? 'Đã chấp nhận'
                      : item.value === 'pending'
                      ? 'Đang xử lý'
                      : item.value === 'rejected'
                      ? 'Đã từ chối'
                      : item.value === 'completed'
                      ? 'Đã hoàn thành'
                      : ''
                    // item.label === 'assigned'
                    //   ? 'Đang giao việc'
                    //   : item.label === 'accepted'
                    //   ? 'Đã chấp nhận'
                    //   : item.label === 'pending'
                    //   ? 'Đang xử lý'
                    //   : item.label === 'rejected'
                    //   ? 'Đã từ chối'
                    //   : item.label === 'completed'
                    //   ? 'Đã hoàn thành'
                    //   : ''
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
        </View>
      </Modal>
    </View>
  );
};

export default DropDownPickerStatusComponent;
