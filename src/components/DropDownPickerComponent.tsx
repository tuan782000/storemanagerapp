import {View, Text, Modal, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SelectModel} from '../models/SelectModel';
import TextComponent from './TextComponent';
import RowComponent from './RowComponent';
import {globalStyles} from '../styles/globalStyle';
import {appColors} from '../constants/colors';
import {ArrowDown2, SearchNormal1, TickCircle} from 'iconsax-react-native';
import ButtonComponent from './ButtonComponent';
import InputComponent from './InputComponent';
import SpaceComponent from './SpaceComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {fontFamilies} from '../constants/fontFamilies';

interface Props {
  title?: string; // tiêu đề
  values: SelectModel[]; // danh sách người dùng - có thể chọn "items" - nó sẽ được truyền từ thằng cha vào
  selected?: string[]; // cái người dùng chọn
  onSelect: (val: string[]) => void; // hàm chọn
  multiple?: boolean; // được chọn nhiều hay không
}

const DropDownPickerComponent = (props: Props) => {
  const {title, values, selected, onSelect, multiple} = props;
  // console.log(values);
  const [isVisible, setIsVisible] = useState(false);
  // keyword người dùng đã search
  const [searchKey, setSearchKey] = useState('');
  // kết quả search được
  const [results, setResults] = useState<SelectModel[]>([]);
  // data người dùng đã chọn
  const [dataSelected, setDataSelected] = useState<string[]>([]);

  useEffect(() => {
    selected && setDataSelected(selected);
  }, [isVisible, selected]);

  useEffect(() => {
    if (!searchKey) {
      setResults([]);
    } else {
      const data = values.filter(element =>
        element.label.toLowerCase().includes(searchKey.toLowerCase()),
      );

      setResults(data);
    }
  }, [searchKey]);

  const handleSelectItem = (id: string) => {
    if (multiple) {
      const data = [...dataSelected];

      const index = data.findIndex(element => element === id);

      if (index !== -1) {
        data.splice(index, 1);
      } else {
        data.push(id);
      }
      setDataSelected(data);
    } else {
      setDataSelected([id]);
    }
  };

  const handleConfirmSelect = () => {
    onSelect(dataSelected); // lấy cái người dùng chọn gửi ngược lên cha - two-way bindings
    setIsVisible(false);
    setDataSelected([]);
  };

  const handleRemoveItemSelected = (index: number) => {
    if (selected) {
      selected?.splice(index, 1);

      onSelect(selected);
    }
  };

  const renderSelectedItem = (id: string, index: number) => {
    const item = values.find(element => element.value === id);
    return (
      item && (
        <RowComponent
          onPress={() => handleRemoveItemSelected(index)}
          key={id}
          styles={{
            borderWidth: 0.5,
            borderRadius: 8,
            padding: 8,
            marginRight: 4,
            marginBottom: 8,
          }}>
          <TextComponent text={item.label} flex={0} />
          <SpaceComponent width={5} />
          <AntDesign name="close" size={14} color={appColors.gray} />
        </RowComponent>
      )
    );
  };
  return (
    <View>
      {title && (
        <TextComponent text={title} font={fontFamilies.bold} size={16} />
      )}
      <RowComponent
        onPress={() => setIsVisible(true)}
        styles={[
          globalStyles.inputContainer,
          {
            marginTop: title ? 8 : 0,
          },
        ]}>
        <View style={{flex: 1, paddingRight: 12}}>
          {selected && selected?.length > 0 ? (
            <RowComponent justify="flex-start" styles={{flexWrap: 'wrap'}}>
              {selected.map((id, index) => renderSelectedItem(id, index))}
            </RowComponent>
          ) : (
            <TextComponent text="Lựa chọn" color={appColors.gray} flex={0} />
          )}
        </View>
        <ArrowDown2 size={22} color={appColors.gray} />
      </RowComponent>
      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        style={{flex: 1}}
        statusBarTranslucent>
        <View
          style={[
            globalStyles.container,
            {padding: 20, paddingTop: 60, paddingBottom: 30},
          ]}>
          <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <RowComponent>
                <View style={{flex: 1}}>
                  <InputComponent
                    value={searchKey}
                    onChange={val => setSearchKey(val)}
                    placeholder="Tìm kiếm..."
                    allowClear
                    affix={<SearchNormal1 size={22} color={appColors.gray} />}
                  />
                </View>
                <SpaceComponent width={12} />
                {/* <TouchableOpacity>
                  <TextComponent
                    text="Huỷ"
                    color={appColors.primary}
                    flex={0}
                  />
                </TouchableOpacity> */}
                <ButtonComponent
                  text="Huỷ"
                  onPress={() => setIsVisible(false)}
                  type="primary"
                  styles={{marginTop: -20}}
                />
              </RowComponent>
            }
            style={{flex: 1}}
            data={searchKey ? results : values}
            renderItem={({item}) => (
              <RowComponent
                onPress={() => handleSelectItem(item.value)}
                key={item.value}
                styles={{paddingVertical: 16}}>
                <TextComponent
                  text={item.label}
                  size={16}
                  color={
                    dataSelected.includes(item.value)
                      ? appColors.primary
                      : appColors.text
                  }
                  flex={1}
                />
                {dataSelected.includes(item.value) && (
                  <TickCircle size={22} color={appColors.primary} />
                )}
              </RowComponent>
            )}
          />
          <ButtonComponent
            text="Xác nhận"
            onPress={handleConfirmSelect}
            type="primary"
          />
        </View>
      </Modal>
    </View>
  );
};

export default DropDownPickerComponent;
