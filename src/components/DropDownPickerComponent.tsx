import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SelectModel} from '../models/SelectModel';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {ArrowDown2, SearchNormal, SearchNormal1} from 'iconsax-react-native';
import {appColors} from '../constants/colors';
import {globalStyles} from '../styles/globalStyle';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import InputComponent from './InputComponent';
import ButtonComponent from './ButtonComponent';
import SpaceComponent from './SpaceComponent';
import {fontFamilies} from '../constants/fontFamilies';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
interface Props {
  values: SelectModel[];
  selected?: string | string[];
  onSelect: (val: string | string[]) => void;
  multiple?: boolean;
}

const DropDownPickerComponent = (props: Props) => {
  const {onSelect, values, selected, multiple} = props;
  const [searchKey, setSearchKey] = useState('');
  const [isVisibleModalize, setIsVisibleModalize] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const modalizeRef = useRef<Modalize>();

  // console.log(values);
  console.log(selected);

  useEffect(() => {
    if (isVisibleModalize) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [isVisibleModalize]);

  useEffect(() => {
    if (isVisibleModalize && selected && selected?.length > 0) {
      // setSelectedItems(selected as string[]);
      if (Array.isArray(selected)) {
        setSelectedItems(selected as string[]);
      } else {
        setSelectedItems([selected as string]);
      }
    }
  }, [isVisibleModalize, selected]);

  useEffect(() => {
    if (multiple) {
      onSelect(selectedItems);
    }
  }, [multiple, selectedItems, onSelect]);

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      const data = [...selectedItems];
      const index = selectedItems.findIndex(element => element === id);

      if (index !== -1) {
        data.splice(index, 1);
      }

      setSelectedItems(data);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const renderSelectedItem = (id: string) => {
    const item = values.find(element => element.value === id);

    return item ? (
      <RowComponent key={id} styles={[localStyles.selectedItem]}>
        <TextComponent text={item.label} color={appColors.primary} />
        <SpaceComponent width={8} />
        <TouchableOpacity
          onPress={event => {
            event.persist();
            handleSelectItem(id);
            onSelect(selectedItems);
          }}>
          <AntDesign name="close" size={18} color={appColors.text} />
        </TouchableOpacity>
      </RowComponent>
    ) : (
      <></>
    );
  };

  const renderSelectItem = (item: SelectModel) => {
    return (
      <RowComponent
        onPress={
          multiple
            ? () => handleSelectItem(item.value)
            : () => onSelect(item.value)
        }
        key={item.value}
        styles={[localStyles.listItem]}>
        <TextComponent
          text={item.label}
          flex={1}
          font={
            selectedItems?.includes(item.value)
              ? fontFamilies.bold
              : fontFamilies.regular
          }
          color={
            selectedItems?.includes(item.value)
              ? appColors.primary
              : appColors.text
          }
        />
        {selectedItems?.includes(item.value) && (
          <MaterialCommunityIcons
            name="checkbox-marked-circle-outline"
            size={22}
            color={appColors.primary}
          />
        )}
      </RowComponent>
    );
  };

  return (
    <View>
      <RowComponent styles={[globalStyles.inputContainer]}>
        <RowComponent
          styles={{flex: 1, flexWrap: 'wrap'}}
          onPress={() => setIsVisibleModalize(true)}>
          {selectedItems.length > 0 ? (
            selectedItems.map(item => renderSelectedItem(item))
          ) : (
            <TextComponent text="Chọn" />
          )}
        </RowComponent>
        <ArrowDown2 size={22} color={appColors.text} />
      </RowComponent>
      <Portal>
        <Modalize
          handlePosition="inside"
          scrollViewProps={{showsVerticalScrollIndicator: false}}
          HeaderComponent={
            <RowComponent
              styles={{
                marginBottom: 12,
                paddingHorizontal: 20,
                paddingTop: 30,
              }}>
              <View style={{flex: 1}}>
                <InputComponent
                  styleInput={{marginBottom: 0}}
                  onChange={val => setSearchKey(val)}
                  value={searchKey}
                  placeholder="Tìm kiếm..."
                  allowClear
                  affix={<SearchNormal1 size={22} color={appColors.text} />}
                />
              </View>
              <SpaceComponent width={20} />
              <ButtonComponent
                type="link"
                text="Huỷ"
                onPress={() => modalizeRef.current?.close()}
              />
            </RowComponent>
          }
          FooterComponent={
            multiple && (
              <View style={{paddingHorizontal: 20, paddingBottom: 30}}>
                <ButtonComponent
                  text="Duyệt"
                  type="primary"
                  onPress={() => {
                    onSelect(selectedItems);
                    modalizeRef.current?.close();
                  }}
                />
              </View>
            )
          }
          ref={modalizeRef}
          onClose={() => setIsVisibleModalize(false)}>
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            {values.map(item => renderSelectItem(item))}
          </View>
        </Modalize>
      </Portal>
    </View>
  );
};

export default DropDownPickerComponent;

const localStyles = StyleSheet.create({
  listItem: {
    marginBottom: 20,
  },
  selectedItem: {
    borderWidth: 0.5,
    borderColor: appColors.gray,
    padding: 4,
    marginBottom: 8,
    marginRight: 8,
    borderRadius: 8,
  },
});
