import {View, Text} from 'react-native';
import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {ArrowDown2, Calendar, Calendar2, Clock} from 'iconsax-react-native';
import {appColors} from '../constants/colors';
import {globalStyles} from '../styles/globalStyle';
import {fontFamilies} from '../constants/fontFamilies';
import {DateTime} from '../utils/DateTime';

interface Props {
  type?: 'date' | 'time' | 'datetime';
  selected?: Date;
  onSelect: (val: Date) => void;
  placeholder?: string;
  disable?: boolean;
}

const DateTimePickerComponent = (props: Props) => {
  const {onSelect, placeholder, selected, type, disable} = props;
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  // console.log(selected);
  return (
    <View>
      <RowComponent
        styles={[globalStyles.inputContainer]}
        onPress={() => setIsShowDatePicker(true)}>
        <TextComponent
          text={`${
            selected
              ? type === 'time'
                ? DateTime.getTime(selected)
                : DateTime.dateToDateString(selected)
              : 'Lựa chọn'
          }`}
          flex={1}
          font={fontFamilies.medium}
          styles={{textAlign: 'center'}}
        />
        {type === 'time' ? (
          <Clock size={20} color={appColors.text} />
        ) : (
          <Calendar size={20} color={appColors.text} />
        )}
      </RowComponent>
      <DatePicker
        confirmText="Chọn"
        cancelText="Huỷ"
        mode={type}
        open={isShowDatePicker}
        date={new Date()}
        onCancel={() => setIsShowDatePicker(false)}
        onConfirm={val => {
          setIsShowDatePicker(false);
          onSelect(val);
        }}
        modal
      />
    </View>
  );
};

export default DateTimePickerComponent;
