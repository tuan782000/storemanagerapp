// import {View, Text, Modal, FlatList, TouchableOpacity} from 'react-native';
// import React, {useState} from 'react';
// import {TaskStatus} from '../models/WorkSessionModel';
// import RowComponent from './RowComponent';
// import TextComponent from './TextComponent';
// import SpaceComponent from './SpaceComponent';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import {appColors} from '../constants/colors';
// import {fontFamilies} from '../constants/fontFamilies';
// import {globalStyles} from '../styles/globalStyle';
// import {ArrowDown2, CloseCircle, TickCircle} from 'iconsax-react-native';
// import ButtonComponent from './ButtonComponent';

// interface Props {
//   title?: string;
//   selected?: TaskStatus;
//   onSelect: (val: TaskStatus) => void;
// }

// const DropDownPickerStatusComponent = (props: Props) => {
//   const {title, selected, onSelect} = props;
//   const [isVisible, setIsVisible] = useState(false);
//   const [dataSelected, setDataSelected] = useState<TaskStatus | null>(
//     selected || null,
//   );

//   const statusOptions = Object.values(TaskStatus).filter(
//     status => typeof status === 'string',
//   ) as string[];

//   const handleSelectItem = (status: string) => {
//     const selectedStatus = TaskStatus[status as keyof typeof TaskStatus];
//     setDataSelected(selectedStatus);
//   };

//   const handleConfirmSelect = () => {
//     if (dataSelected !== null) {
//       onSelect(dataSelected);
//       setIsVisible(false);
//       setDataSelected(null);
//     }
//   };

//   console.log(dataSelected);

//   /*
//    status === 'Assigned'
//             ? 'Đã giao việc'
//             : status === 'Accepted'
//             ? 'Nhận công việc'
//             : status === 'Pending'
//             ? 'Xử lý công việc'
//             : status === 'Rejected'
//             ? 'Từ chối công việc'
//             : status === 'Completed'
//             ? 'Đã hoàn thành'
//             : 'Có lỗi xảy ra'
//   */
//   const renderSelectedItem = (status: string) => {
//     return (
//       <RowComponent
//         onPress={() => setDataSelected(null)}
//         key={status}
//         styles={{
//           borderWidth: 0.5,
//           borderRadius: 8,
//           padding: 8,
//           marginRight: 4,
//           marginBottom: 8,
//         }}>
//         <TextComponent text={status} flex={0} />
//         <SpaceComponent width={5} />
//         <AntDesign name="close" size={14} color={appColors.gray} />
//       </RowComponent>
//     );
//   };

//   return (
//     <View>
//       {title && (
//         <TextComponent text={title} font={fontFamilies.bold} size={16} />
//       )}
//       <RowComponent
//         onPress={() => setIsVisible(true)}
//         styles={[
//           globalStyles.inputContainer,
//           {
//             marginTop: title ? 8 : 0,
//           },
//         ]}>
//         <View style={{flex: 1, paddingRight: 12}}>
//           {dataSelected ? (
//             renderSelectedItem(TaskStatus[dataSelected])
//           ) : (
//             <TextComponent
//               text="Lựa chọn trạng thái"
//               color={appColors.gray}
//               flex={0}
//             />
//           )}
//         </View>
//         <ArrowDown2 size={22} color={appColors.gray} />
//       </RowComponent>
//       <Modal
//         visible={isVisible}
//         transparent
//         animationType="slide"
//         style={{flex: 1}}
//         statusBarTranslucent>
//         <View
//           style={[
//             globalStyles.container,
//             {padding: 20, paddingTop: 30, paddingBottom: 30},
//           ]}>
//           <FlatList
//             showsVerticalScrollIndicator={false}
//             style={{flex: 1}}
//             data={statusOptions}
//             ListHeaderComponent={
//               <RowComponent justify="flex-end">
//                 <TouchableOpacity
//                   onPress={() => setIsVisible(false)}
//                   style={{
//                     backgroundColor: appColors.red,
//                     padding: 10,
//                     borderRadius: 999,
//                   }}>
//                   <AntDesign name="close" size={22} color={appColors.white} />
//                 </TouchableOpacity>
//               </RowComponent>
//             }
//             renderItem={({item}) => (
//               <RowComponent
//                 onPress={() => handleSelectItem(item)}
//                 key={item}
//                 styles={{paddingVertical: 16}}>
//                 <TextComponent
//                   text={
//                     item && item === 'Assigned'
//                       ? 'Đã giao việc'
//                       : item === 'Accepted'
//                       ? 'Nhận công việc'
//                       : item === 'Pending'
//                       ? 'Xử lý công việc'
//                       : item === 'Rejected'
//                       ? 'Từ chối công việc'
//                       : item === 'Completed'
//                       ? 'Đã hoàn thành'
//                       : 'Có lỗi xảy ra'
//                   }
//                   size={16}
//                   color={
//                     dataSelected === TaskStatus[item as keyof typeof TaskStatus]
//                       ? appColors.primary
//                       : appColors.text
//                   }
//                   flex={1}
//                 />
//                 {dataSelected ===
//                   TaskStatus[item as keyof typeof TaskStatus] && (
//                   <TickCircle size={22} color={appColors.primary} />
//                 )}
//               </RowComponent>
//             )}
//           />
//           <ButtonComponent
//             text="Xác nhận"
//             onPress={handleConfirmSelect}
//             type="primary"
//           />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default DropDownPickerStatusComponent;

import {View, Text, Modal, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SelectModel} from '../models/SelectModel';
import {TaskStatus} from '../models/WorkSessionModel';
import RowComponent from './RowComponent';
import {globalStyles} from '../styles/globalStyle';
import TextComponent from './TextComponent';
import {appColors} from '../constants/colors';
import {ArrowDown2, TickCircle} from 'iconsax-react-native';
import {SelectStatusModel} from '../models/SelectStatusModel';
import ButtonComponent from './ButtonComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SpaceComponent from './SpaceComponent';

interface Props {
  items: SelectStatusModel[];
  selected?: TaskStatus;
  onSelect: (val: number) => void;
}

const DropDownPickerStatusComponent = (props: Props) => {
  const {items, selected, onSelect} = props;
  const [isVisible, setIsVisible] = useState(false);
  const [dataSelected, setDataSelected] = useState<number>(0);

  //   useEffect(() => {
  //     selected && setDataSelected;
  //   }, [isVisible, dataSelected]);

  const handleSelectedItem = (id: number) => {
    if (dataSelected === id) {
      // Deselect the item if already selected
      setDataSelected(0);
    } else {
      // Select the item if not selected
      setDataSelected(id);
    }
  };

  //   console.log(dataSelected);
  const handleConfirmSelect = () => {
    onSelect(dataSelected);
    setIsVisible(false);
    setDataSelected(0);
  };

  return (
    <View>
      <RowComponent
        onPress={() => setIsVisible(true)}
        styles={[globalStyles.inputContainer]}>
        <View style={{flex: 1, paddingRight: 12}}>
          {/* {dataSelected ? (
            // renderSelectedItem(TaskStatus[dataSelected])
            <TextComponent text="" />
          ) : (
            <TextComponent
              text="Lựa chọn trạng thái công việc"
              color={appColors.gray}
              flex={0}
            />
          )} */}
          <TextComponent
            text="Lựa chọn trạng thái công việc"
            color={appColors.gray}
            flex={0}
          />
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
            {padding: 20, paddingTop: 30, paddingBottom: 30},
          ]}>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            data={items}
            renderItem={({item}) => (
              <RowComponent
                onPress={() => {
                  handleSelectedItem(item.value);
                }}
                key={item.value}
                styles={{paddingVertical: 16}}
                justify="space-between">
                <TextComponent
                  text={
                    item.label === 0
                      ? 'Đã giao việc'
                      : item.label === 1
                      ? 'Nhận công việc'
                      : item.label === 2
                      ? 'Xử lý công việc'
                      : item.label === 3
                      ? 'Từ chối công việc'
                      : item.label === 4
                      ? 'Đã hoàn thành công việc'
                      : 'Có lỗi xảy ra'
                  }
                  color={
                    dataSelected === item.value
                      ? appColors.primary
                      : appColors.text
                  }
                  size={16}
                />
                {dataSelected === item.value && (
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
          <SpaceComponent height={20} />
          <ButtonComponent
            text="Huỷ"
            // onPress={handleConfirmSelect}
            onPress={() => {
              setIsVisible(false);
            }}
            type="primary"
            styles={{backgroundColor: appColors.red}}
          />
        </View>
      </Modal>
    </View>
  );
};

export default DropDownPickerStatusComponent;
