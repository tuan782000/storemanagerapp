import {View, Text} from 'react-native';
import React from 'react';
import {SelectModel} from '../models/SelectModel';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {ArrowDown2} from 'iconsax-react-native';
import {appColors} from '../constants/colors';
import {globalStyles} from '../styles/globalStyle';

interface Props {
  values: SelectModel[];
  selected?: string | string[];
  onSelect: (val: string) => void;
}

const DropDownPickerComponent = (props: Props) => {
  const {onSelect, values, selected} = props;
  return (
    <View>
      <RowComponent styles={[globalStyles.inputContainer]}>
        <RowComponent styles={{flex: 1}} onPress={() => {}}>
          <TextComponent text="Select" />
        </RowComponent>
        <ArrowDown2 size={22} color={appColors.text} />
      </RowComponent>
    </View>
  );
};

export default DropDownPickerComponent;
