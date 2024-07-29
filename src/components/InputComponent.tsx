import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {ReactNode, useState} from 'react';
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
  styleDisabled?: StyleProp<ViewStyle>;
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
    styleDisabled,
    allowClear,
  } = props;
  const [isShowPass, setIsShowPass] = useState(isPassword ?? false);
  return (
    <View style={[globalStyles.inputContainer, {}, styleDisabled]}>
      {affix ?? affix}
      <TextInput
        editable={disabled}
        style={[globalStyles.input, globalStyles.text]}
        value={value}
        placeholder={placeholder ?? ''}
        onChangeText={val => onChange(val)}
        secureTextEntry={isShowPass}
        placeholderTextColor={'#747688'}
        keyboardType={type ?? 'default'}
        autoCapitalize="none"
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
            <AntDesign name="close" size={22} color={appColors.text} />
          )
        )}
      </TouchableOpacity>
      {suffix ?? suffix}
    </View>
  );
};

export default InputComponent;
