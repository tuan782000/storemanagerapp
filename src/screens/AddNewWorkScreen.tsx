import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAvoidingView, TextInput, TouchableOpacity} from 'react-native';
import {
  ContainerComponent,
  DateTimePickerComponent,
  DropDownPickerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../components';
import DividerComponent from '../components/DividerComponent';
// import {TaskStatus, TasksModel} from '../models/TasksModel';
import {AddCircle, Edit2, Money2} from 'iconsax-react-native';
import Toast from 'react-native-toast-message';
import {HandleCustomerAPI} from '../apis/handleCustomerAPI';
import {HandleUserAPI} from '../apis/handleUserAPI';
import {HandleWorkSessionAPI} from '../apis/handleWorkSessionAPI';
import ButtonComponent from '../components/ButtonComponent';
import {appColors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';
import {SelectModel} from '../models/SelectModel';
import {TaskStatus} from '../models/WorkSessionModel';
import {DateTime} from '../utils/DateTime';
import {formatNumber} from '../utils/formatNumber';

const initialTask = {
  employee_id: [],
  customer_id: [],
  description: '',
  amount: 0,
  payment_amount: 0,
  start_time: Date.now(),
  end_time: Date.now(),
  status: TaskStatus.Assigned,
};

const initialErrors = {
  employee_id: '',
  customer_id: '',
  description: '',
  amount: '',
  payment_amount: '',
  start_time: '',
  end_time: '',
};

const AddNewWorkScreen = ({navigation}: any) => {
  const [workForm, setWorkForm] = useState<any>(initialTask);
  const [errors, setErrors] = useState<any>(initialErrors);
  const [staffsSelect, setStaffsSelect] = useState<SelectModel[]>([]);
  const [customersSelect, setCustomersSelect] = useState<SelectModel[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const amountRef = useRef<TextInput>(null);

  useEffect(() => {
    // Lắng nghe sự kiện khi màn hình được focus
    const unsubscribe = navigation.addListener('focus', () => {
      handleGetAllCustomers();
    });

    // Dọn dẹp listener khi component bị unmount
    return unsubscribe;
  }, [navigation]);

  // tránh bị vòng lặp vô tận việc gọi hàm handleGetAllStaffs
  // khi đi từ bất cứ đâu vào đảm bảo cái hàm này sẽ chạy được lần đầu tiên
  useEffect(() => {
    handleGetAllStaffs();
    handleGetAllCustomers();
  }, []);

  const handleGetAllStaffs = async () => {
    try {
      const api = '/getListEmployees';
      const listStaff = await HandleUserAPI.Info(api);

      const items: SelectModel[] = [];

      listStaff.data.forEach((staff: any) => {
        staff.email &&
          items.push({
            label: staff.username ? staff.username : staff.email,
            value: staff._id,
          });
      });

      setStaffsSelect(items);
    } catch (error: any) {
      console.error('Error fetching data: ', error);
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: error.message,
        visibilityTime: 1000,
      });
    }
  };

  const handleGetAllCustomers = async () => {
    try {
      const api = '/listCustomer';
      const listCustomer = await HandleCustomerAPI.Customer(api);

      const items: SelectModel[] = [];

      listCustomer.data.forEach((customer: any) => {
        customer.email &&
          items.push({
            label: customer.name ? customer.name : customer.email,
            value: customer._id,
          });
      });

      setCustomersSelect(items);
    } catch (error: any) {
      console.error('Error fetching data: ', error);
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: error.message,
        visibilityTime: 10000,
      });
    }
  };

  const handleAmountChange = (text: string) => {
    const numericValue: string = text.replace(/\./g, ''); // Remove old dots
    handleChangeValue('amount', numericValue); // Save raw value
    const formattedValue: string = formatNumber(numericValue);

    // Update the display value in the TextInput
    amountRef.current?.setNativeProps({text: formattedValue});
  };

  const handleChangeValue = (
    key: string,
    value: string | Date | string[] | number,
  ) => {
    const data: any = {...workForm};
    // if (key === 'amount' || key === 'payment_amount') {
    //   data[`${key}`] = Number(value);
    // } else {
    //   data[`${key}`] = value;
    // }

    // Chuyển đổi giá trị thành số nếu là chuỗi có thể chuyển đổi
    if (typeof value === 'string') {
      value = isNaN(Number(value)) ? value : Number(value);
    }

    // Cập nhật giá trị cho workForm
    data[`${key}`] = value;

    setWorkForm(data);
    handleValidateInput(key, value);
  };

  const handleValidateInput = (
    key: string,
    value: string | Date | string[] | number,
  ) => {
    const newErrors: any = {...errors};
    switch (key) {
      case 'employee_id':
        if (Array.isArray(value)) {
          newErrors.employee_id =
            value.length === 0 ? 'Vui lòng chọn ít nhất một nhân viên' : '';
        }
        break;

      case 'customer_id':
        if (Array.isArray(value)) {
          newErrors.customer_id =
            value.length === 0 ? 'Vui lòng chọn ít nhất một khách hàng' : '';
        }
        break;

      case 'description':
        if (typeof value === 'string') {
          newErrors.description =
            value.length < 10 ? 'Mô tả công việc phải lớn hơn 10 ký tự' : '';
        }
        break;

      case 'amount':
        if (typeof value === 'number') {
          newErrors.amount =
            value > 0 ? '' : 'Không được nhập số âm hoặc bằng 0';
        }
        break;
      case 'payment_amount':
        if (typeof value === 'number') {
          newErrors.payment_amount =
            value <= 0
              ? 'Không được nhập số âm hoặc bằng 0'
              : value > 100
              ? 'Không được nhập quá 100'
              : '';
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleRegister = async () => {
    console.log(workForm);
    if (Object.values(errors).some(error => error !== '')) {
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Có lỗi trong form',
        visibilityTime: 1000,
      });
      return;
    }

    if (new Date(workForm.start_time) > new Date(workForm.end_time)) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        start_time: 'Ngày bắt đầu phải nhỏ hơn ngày dự kiến hoàn thành',
      }));
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Ngày bắt đầu phải nhỏ hơn ngày dự kiến hoàn thành',
        visibilityTime: 1000,
      });
      return;
    }

    if (workForm.employee_id.length === 0) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        employee_id: 'Phải chọn thợ',
      }));
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Phải chọn thợ',
        visibilityTime: 1000,
      });
      return;
    }
    if (workForm.customer_id.length === 0) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        customer_id: 'Phải chọn khách hàng',
      }));
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Phải chọn khách hàng',
        visibilityTime: 1000,
      });
      return;
    }

    if (workForm.description === '') {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        description: 'Phải mô tả công việc rõ ràng',
      }));
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Phải mô tả công việc rõ ràng',
        visibilityTime: 1000,
      });
      return;
    }

    setIsLoading(true);
    if (
      workForm.employee_id.length > 0 &&
      workForm.customer_id.length > 0 &&
      workForm.description !== ''
    ) {
      setErrors(initialErrors);
      try {
        // console.log(workForm);
        const api = '/createWorkSession';
        await HandleWorkSessionAPI.WorkSession(
          api,
          {
            employee_id: workForm.employee_id,
            customer_id: workForm.customer_id,
            description: workForm.description,
            amount: workForm.amount,
            payment_amount: workForm.payment_amount,
            start_time: DateTime.convertToTimestamp(workForm.start_time),
            end_time: DateTime.convertToTimestamp(workForm.end_time),
            status: TaskStatus.Assigned,
            created_at: Date.now(),
            updated_at: Date.now(),
          },
          'post',
        );
        setWorkForm(initialTask);
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Đăng ký công việc thành công!!!',
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
    <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
      <ContainerComponent back isScroll title="Thêm công việc mới">
        <SpaceComponent height={10} />
        <DividerComponent />
        <SpaceComponent height={10} />
        <SectionComponent>
          <RowComponent
            styles={{
              marginBottom: 8,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}>
            <RowComponent>
              <TextComponent
                text="Chọn nhân viên"
                size={16}
                font={fontFamilies.bold}
                flex={1}
              />
            </RowComponent>
            <SpaceComponent height={10} />
            {errors['employee_id'] ? (
              <>
                <TextComponent
                  text={errors['employee_id']}
                  color={appColors.red}
                />
                <SpaceComponent height={5} />
              </>
            ) : null}
            <DropDownPickerComponent
              values={staffsSelect}
              selected={workForm.employee_id}
              onSelect={val => handleChangeValue('employee_id', val)}
            />
          </RowComponent>
          <RowComponent
            styles={{
              marginBottom: 8,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}>
            <RowComponent>
              <TextComponent
                text="Chọn khác hàng"
                size={16}
                font={fontFamilies.bold}
                flex={1}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate('AddNewCustomerScreen')}>
                <AddCircle size={22} color={appColors.primary} />
              </TouchableOpacity>
            </RowComponent>
            <SpaceComponent height={10} />
            {errors['customer_id'] ? (
              <>
                <TextComponent
                  text={errors['customer_id']}
                  color={appColors.red}
                />
                <SpaceComponent height={5} />
              </>
            ) : null}
            <DropDownPickerComponent
              values={customersSelect}
              selected={workForm.customer_id}
              onSelect={val => handleChangeValue('customer_id', val)}
            />
          </RowComponent>
          <RowComponent
            styles={{
              marginBottom: 8,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}>
            <TextComponent
              text="Mô tả công việc"
              size={16}
              font={fontFamilies.bold}
            />
            <SpaceComponent height={10} />
            {errors['description'] ? (
              <>
                <TextComponent
                  text={errors['description']}
                  color={appColors.red}
                />
                <SpaceComponent height={5} />
              </>
            ) : null}
            <InputComponent
              type="default"
              value={workForm.description}
              onChange={val => handleChangeValue('description', val)}
              placeholder="Mô tả công việc"
              multiple
              numberOfLines={4}
              affix={<Edit2 size={20} color={appColors.gray} />}
              allowClear
            />
          </RowComponent>
          <RowComponent
            styles={{
              marginBottom: 8,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}>
            <RowComponent>
              <TextComponent
                text="Nhập giá tiền"
                size={16}
                font={fontFamilies.bold}
                flex={1}
              />
            </RowComponent>
            <SpaceComponent height={10} />
            {errors['amount'] ? (
              <>
                <TextComponent text={errors['amount']} color={appColors.red} />
                <SpaceComponent height={5} />
              </>
            ) : null}
            <InputComponent
              inputRef={amountRef}
              type="numeric"
              value={workForm.amount}
              // onChange={val => handleChangeValue('amount', val)}
              onChange={handleAmountChange} // Sử dụng hàm handleAmountChange
              placeholder="Vui lòng nhập số tiền công việc"
              affix={<Money2 size={20} color={appColors.gray} />}
            />
          </RowComponent>
          <RowComponent
            styles={{
              marginBottom: 8,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}>
            <RowComponent>
              <TextComponent
                text="Phần trăm chia cho thợ"
                size={16}
                font={fontFamilies.bold}
                flex={1}
              />
            </RowComponent>
            <SpaceComponent height={10} />
            {errors['payment_amount'] ? (
              <>
                <TextComponent
                  text={errors['payment_amount']}
                  color={appColors.red}
                />
                <SpaceComponent height={5} />
              </>
            ) : null}
            <InputComponent
              type="numeric"
              value={workForm.payment_amount}
              onChange={val => handleChangeValue('payment_amount', val)}
              placeholder="Vui lòng nhập số phần trăm"
              affix={<Money2 size={20} color={appColors.gray} />}
            />
          </RowComponent>

          <RowComponent justify="space-between">
            <RowComponent
              styles={{
                marginBottom: 8,
                flexDirection: 'column',
                alignItems: 'flex-start',
                flex: 1,
              }}>
              <TextComponent
                text="Ngày bắt đầu"
                size={16}
                font={fontFamilies.bold}
              />
              <SpaceComponent height={10} />
              <DateTimePickerComponent
                type="date"
                onSelect={val => handleChangeValue('start_time', val)}
                selected={workForm.start_time}
              />
            </RowComponent>
            <SpaceComponent width={10} />
            <RowComponent
              styles={{
                marginBottom: 8,
                flexDirection: 'column',
                alignItems: 'flex-start',
                flex: 1,
              }}>
              <TextComponent
                text="Dự kiến hoàn thành"
                size={16}
                font={fontFamilies.bold}
              />
              <SpaceComponent height={10} />
              <DateTimePickerComponent
                type="date"
                onSelect={val => handleChangeValue('end_time', val)}
                selected={workForm.end_time}
              />
            </RowComponent>
          </RowComponent>

          <ButtonComponent
            text="Tạo công việc"
            onPress={handleRegister}
            type="primary"
          />
        </SectionComponent>
      </ContainerComponent>
    </KeyboardAvoidingView>
  );
};

export default AddNewWorkScreen;
