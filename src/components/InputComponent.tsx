import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {ReactNode, RefObject, useState} from 'react';
import {EyeSlash} from 'iconsax-react-native';
import {appColors} from '../constants/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {globalStyles} from '../styles/globalStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface Props {
  value: string;
  onChange: (val: string) => void;
  affix?: ReactNode;
  suffix?: ReactNode;
  placeholder?: string | undefined;
  isPassword?: boolean;
  allowClear?: boolean;
  type?: KeyboardType;
  disabled?: boolean;
  styleInput?: StyleProp<ViewStyle>;
  multiple?: boolean;
  numberOfLines?: number;
  inputRef?: RefObject<TextInput>;
}

const InputComponent = (props: Props) => {
  const {
    onChange,
    value,
    affix,
    isPassword,
    placeholder,
    suffix,
    type,
    disabled,
    styleInput,
    allowClear,
    multiple,
    numberOfLines,
    inputRef,
  } = props;
  const [isShowPass, setIsShowPass] = useState(isPassword ?? false);
  return (
    <View
      style={[
        globalStyles.inputContainer,
        {
          minHeight: numberOfLines && multiple ? numberOfLines * 56 : 56,
          alignItems: numberOfLines && multiple ? 'flex-start' : 'center',
          paddingTop: multiple ? 12 : 0,
        },
        styleInput,
      ]}>
      {affix ?? affix}
      <TextInput
        ref={inputRef}
        editable={disabled}
        style={[
          globalStyles.input,
          globalStyles.text,
          {
            textAlignVertical: multiple ? 'top' : 'auto',
          },
        ]}
        value={value}
        placeholder={placeholder ?? ''}
        onChangeText={val => onChange(val)}
        secureTextEntry={isShowPass}
        placeholderTextColor={'#747688'}
        keyboardType={type ?? 'default'}
        autoCapitalize="none"
        multiline={multiple}
        numberOfLines={numberOfLines}
      />
      <TouchableOpacity
        onPress={
          isPassword ? () => setIsShowPass(!isShowPass) : () => onChange('')
        }>
        {isPassword ? (
          <FontAwesome
            name={isShowPass ? 'eye-slash' : 'eye'}
            size={22}
            color={appColors.gray}
          />
        ) : (
          value.length > 0 &&
          allowClear && (
            <AntDesign
              name="close"
              size={22}
              color={appColors.text}
              style={{paddingTop: 0}}
            />
          )
        )}
      </TouchableOpacity>
      {suffix ?? suffix}
    </View>
  );
};

export default InputComponent;
