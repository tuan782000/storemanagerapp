// import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import {SelectModel} from '../models/SelectModel';
// import RowComponent from './RowComponent';
// import TextComponent from './TextComponent';
// import {ArrowDown2, SearchNormal, SearchNormal1} from 'iconsax-react-native';
// import {appColors} from '../constants/colors';
// import {globalStyles} from '../styles/globalStyle';
// import {Modalize} from 'react-native-modalize';
// import {Portal} from 'react-native-portalize';
// import InputComponent from './InputComponent';
// import ButtonComponent from './ButtonComponent';
// import SpaceComponent from './SpaceComponent';
// import {fontFamilies} from '../constants/fontFamilies';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// interface Props {
//   values: SelectModel[];
//   selected?: string | string[];
//   onSelect: (val: string | string[]) => void;
//   multiple?: boolean;
// }

// const DropDownPickerComponent = (props: Props) => {
//   const {onSelect, values, selected, multiple} = props;
//   const [searchKey, setSearchKey] = useState('');
//   const [isVisibleModalize, setIsVisibleModalize] = useState(false);
//   const [selectedItems, setSelectedItems] = useState<string[]>([]);
//   const modalizeRef = useRef<Modalize>();

//   // console.log(values);
//   console.log(selected);

//   useEffect(() => {
//     if (isVisibleModalize) {
//       modalizeRef.current?.open();
//     } else {
//       modalizeRef.current?.close();
//     }
//   }, [isVisibleModalize]);

//   useEffect(() => {
//     if (isVisibleModalize && selected && selected?.length > 0) {
//       // setSelectedItems(selected as string[]);
//       if (Array.isArray(selected)) {
//         setSelectedItems(selected as string[]);
//       } else {
//         setSelectedItems([selected as string]);
//       }
//     }
//   }, [isVisibleModalize, selected]);

//   useEffect(() => {
//     if (multiple) {
//       onSelect(selectedItems);
//     }
//   }, [multiple, selectedItems, onSelect]);

//   const handleSelectItem = (id: string) => {
//     if (selectedItems.includes(id)) {
//       const data = [...selectedItems];
//       const index = selectedItems.findIndex(element => element === id);

//       if (index !== -1) {
//         data.splice(index, 1);
//       }

//       setSelectedItems(data);
//     } else {
//       setSelectedItems([...selectedItems, id]);
//     }
//   };

//   const renderSelectedItem = (id: string) => {
//     const item = values.find(element => element.value === id);

//     return item ? (
//       <RowComponent key={id} styles={[localStyles.selectedItem]}>
//         <TextComponent text={item.label} color={appColors.primary} />
//         <SpaceComponent width={8} />
//         <TouchableOpacity
//           onPress={event => {
//             event.persist();
//             handleSelectItem(id);
//             onSelect(selectedItems);
//           }}>
//           <AntDesign name="close" size={18} color={appColors.text} />
//         </TouchableOpacity>
//       </RowComponent>
//     ) : (
//       <></>
//     );
//   };

//   const renderSelectItem = (item: SelectModel) => {
//     return (
//       <RowComponent
//         onPress={
//           multiple
//             ? () => handleSelectItem(item.value)
//             : () => onSelect(item.value)
//         }
//         key={item.value}
//         styles={[localStyles.listItem]}>
//         <TextComponent
//           text={item.label}
//           flex={1}
//           font={
//             selectedItems?.includes(item.value)
//               ? fontFamilies.bold
//               : fontFamilies.regular
//           }
//           color={
//             selectedItems?.includes(item.value)
//               ? appColors.primary
//               : appColors.text
//           }
//         />
//         {selectedItems?.includes(item.value) && (
//           <MaterialCommunityIcons
//             name="checkbox-marked-circle-outline"
//             size={22}
//             color={appColors.primary}
//           />
//         )}
//       </RowComponent>
//     );
//   };

//   return (
//     <View>
//       <RowComponent styles={[globalStyles.inputContainer]}>
//         <RowComponent
//           styles={{flex: 1, flexWrap: 'wrap'}}
//           onPress={() => setIsVisibleModalize(true)}>
//           {selectedItems.length > 0 ? (
//             selectedItems.map(item => renderSelectedItem(item))
//           ) : (
//             <TextComponent text="Chọn" />
//           )}
//         </RowComponent>
//         <ArrowDown2 size={22} color={appColors.text} />
//       </RowComponent>
//       <Portal>
//         <Modalize
//           handlePosition="inside"
//           scrollViewProps={{showsVerticalScrollIndicator: false}}
//           HeaderComponent={
//             <RowComponent
//               styles={{
//                 marginBottom: 12,
//                 paddingHorizontal: 20,
//                 paddingTop: 30,
//               }}>
//               <View style={{flex: 1}}>
//                 <InputComponent
//                   styleInput={{marginBottom: 0}}
//                   onChange={val => setSearchKey(val)}
//                   value={searchKey}
//                   placeholder="Tìm kiếm..."
//                   allowClear
//                   affix={<SearchNormal1 size={22} color={appColors.text} />}
//                 />
//               </View>
//               <SpaceComponent width={20} />
//               <ButtonComponent
//                 type="link"
//                 text="Huỷ"
//                 onPress={() => modalizeRef.current?.close()}
//               />
//             </RowComponent>
//           }
//           FooterComponent={
//             multiple && (
//               <View style={{paddingHorizontal: 20, paddingBottom: 30}}>
//                 <ButtonComponent
//                   text="Duyệt"
//                   type="primary"
//                   onPress={() => {
//                     onSelect(selectedItems);
//                     modalizeRef.current?.close();
//                   }}
//                 />
//               </View>
//             )
//           }
//           ref={modalizeRef}
//           onClose={() => setIsVisibleModalize(false)}>
//           <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
//             {values.map(item => renderSelectItem(item))}
//           </View>
//         </Modalize>
//       </Portal>
//     </View>
//   );
// };

// export default DropDownPickerComponent;

// const localStyles = StyleSheet.create({
//   listItem: {
//     marginBottom: 20,
//   },
//   selectedItem: {
//     borderWidth: 0.5,
//     borderColor: appColors.gray,
//     padding: 4,
//     marginBottom: 8,
//     marginRight: 8,
//     borderRadius: 8,
//   },
// });

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
      {title && <TextComponent text={title} />}
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
