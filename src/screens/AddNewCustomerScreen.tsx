import {CallAdd, Location, Sms, User} from 'iconsax-react-native';
import React, {useState} from 'react';
import {View} from 'react-native';
import Toast from 'react-native-toast-message';
import {HandleCustomerAPI} from '../apis/handleCustomerAPI';
import {
  ContainerComponent,
  InputComponent,
  LoadingComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../components';
import ButtonComponent from '../components/ButtonComponent';
import DividerComponent from '../components/DividerComponent';
import {appColors} from '../constants/colors';

const initialCustomer = {
  email: '',
  name: '',
  phone: '',
  address: '',
};

const initialErrors = {
  email: '',
  name: '',
  phone: '',
  address: '',
};

const initialIcons = {
  email: <Sms size={20} color={appColors.gray} />,
  name: <User size={20} color={appColors.gray} />,
  phone: <CallAdd size={20} color={appColors.gray} />,
  address: (
    <Location size={20} color={appColors.gray} style={{marginTop: 22}} />
  ),
};

const AddNewCustomerScreen = ({navigation}: any) => {
  const [customerForm, setCustomerForm] = useState<any>(initialCustomer);
  const [errors, setErrors] = useState<any>(initialErrors);
  const icons: any = initialIcons;
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeValue = (key: string, value: string) => {
    const data: any = {...customerForm};
    data[`${key}`] = value;

    setCustomerForm(data);
    handleValidateInput(key, value);
  };

  const handleValidateInput = (key: string, value: string) => {
    const newErrors = {...errors};

    switch (key) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        newErrors.email = !emailRegex.test(value)
          ? 'Vui lòng nhập đúng định dạng email'
          : '';
        break;

      case 'name':
        newErrors.name = value.length < 3 ? 'Số ký tự phải lớn hơn 3' : '';
        break;

      case 'phone':
        newErrors.phone =
          value.length < 9 || value.length > 12
            ? 'Số điện thoại phải là 10 hoặc 11 số'
            : '';
        break;

      case 'address':
        newErrors.address =
          value.length < 3 ? 'Vui lòng nhập chính xác địa chỉ' : '';
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleRegister = async () => {
    if (Object.values(errors).some(error => error !== '')) {
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Có lỗi trong form',
        visibilityTime: 1000,
      });
      return;
    }

    setIsLoading(true);

    if (
      customerForm.email !== '' &&
      customerForm.name !== '' &&
      customerForm.phone !== '' &&
      customerForm.password !== ''
    ) {
      setErrors(initialErrors);
      try {
        const api = '/registerCustomer';

        await HandleCustomerAPI.Customer(api, customerForm, 'post');

        setCustomerForm(initialCustomer);
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Tạo khách hàng thành công!!!',
          visibilityTime: 1000,
        });
        navigation.goBack();
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Thất bại',
          text2: error.message,
          visibilityTime: 10000,
        });
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ContainerComponent back isScroll title="Thêm khách hàng mới">
      <SpaceComponent height={10} />
      <DividerComponent />
      <SpaceComponent height={10} />
      <SectionComponent>
        {Object.keys(customerForm).map(key => (
          <View key={key}>
            {errors[key] ? (
              <TextComponent text={errors[key]} color={appColors.red} />
            ) : null}
            <InputComponent
              value={customerForm[`${key}`]}
              onChange={value => handleChangeValue(key, value)}
              placeholder={`Please enter your ${key}`}
              allowClear
              affix={icons[key]}
              type={key === 'phone' ? 'phone-pad' : 'default'}
              multiple={key === 'address' ? true : false}
              numberOfLines={key === 'address' ? 4 : undefined}
            />
          </View>
        ))}
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          onPress={handleRegister}
          type="primary"
          text="Tạo khách hàng mới"
          styles={{
            backgroundColor: appColors.success,
          }}
        />
      </SectionComponent>

      <LoadingComponent visible={isLoading} />
    </ContainerComponent>
  );
};

export default AddNewCustomerScreen;
