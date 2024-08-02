import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {TaskStatus, TasksModel} from '../models/TasksModel';
import {
  AddCircle,
  Calendar,
  CalendarTick,
  Edit2,
  Location,
  Note,
  User,
} from 'iconsax-react-native';
import {appColors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';
import {SelectModel} from '../models/SelectModel';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import {UserModel} from '../models/UserModel';
import ButtonComponent from '../components/ButtonComponent';
import {DateTime} from '../utils/DateTime';

const initialTask = {
  employee_id: [],
  customer_id: [],
  description: '',
  assigned_at: Date.now(),
  completed_at: Date.now(),
  status: TaskStatus.Pending,
};

const initialErrors = {
  employee_id: '',
  customer_id: '',
  description: '',
  assigned_at: '',
  completed_at: '',
};

// const initialIcons = {
//   employee_id: <User size={20} color={appColors.gray} />,
//   customer_id: <User size={20} color={appColors.gray} />,
//   description: <Note size={20} color={appColors.gray} />,
//   assigned_at: <Calendar size={20} color={appColors.gray} />,
//   completed_at: <CalendarTick size={20} color={appColors.gray} />,
// };

const AddNewWorkScreen = ({navigation}: any) => {
  const [workForm, setWorkForm] = useState<any>(initialTask);
  const [errors, setErrors] = useState<any>(initialErrors);
  const [staffsSelect, setStaffsSelect] = useState<SelectModel[]>([]);
  const [customersSelect, setCustomersSelect] = useState<SelectModel[]>([]);

  // const icons: any = initialIcons;
  const [isLoading, setIsLoading] = useState(false);

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
      const snapshot = await firestore()
        .collection('users')
        .where('role', '==', 'employee')
        .get();
      const items: SelectModel[] = [];

      snapshot.docs.forEach((doc: any) => {
        const data = doc.data();
        data.email &&
          items.push({
            label: data.username ? data.username : data.email,
            value: doc.id,
          });
      });

      setStaffsSelect(items);
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

  const handleGetAllCustomers = async () => {
    try {
      const snapshot = await firestore().collection('customers').get();

      const items: SelectModel[] = [];

      snapshot.docs.forEach((doc: any) => {
        const data = doc.data();
        data.email &&
          items.push({
            label: data.username ? data.username : data.email,
            value: doc.id,
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

  const handleChangeValue = (key: string, value: string | Date | string[]) => {
    const data: any = {...workForm};
    data[`${key}`] = value;

    setWorkForm(data);
    handleValidateInput(key, value);
  };

  const handleValidateInput = (
    key: string,
    value: string | Date | string[],
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

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleRegister = async () => {
    // console.log(workForm);
    if (Object.values(errors).some(error => error !== '')) {
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Có lỗi trong form',
        visibilityTime: 1000,
      });
      return;
    }

    if (new Date(workForm.assigned_at) > new Date(workForm.completed_at)) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        assigned_at: 'Ngày bắt đầu phải nhỏ hơn ngày dự kiến hoàn thành',
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
        console.log(workForm);

        await firestore()
          .collection('works')
          .add({
            employee_id: workForm.employee_id,
            customer_id: workForm.customer_id,
            description: workForm.description,
            assigned_at: DateTime.convertToTimestamp(workForm.assigned_at),
            completed_at: DateTime.convertToTimestamp(workForm.completed_at),
            status: TaskStatus.Pending,
            created_at: Date.now(),
            updated_at: Date.now(),
          });
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
            <TextComponent text={errors['employee_id']} color={appColors.red} />
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
            <TextComponent text={errors['customer_id']} color={appColors.red} />
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
            <TextComponent text={errors['description']} color={appColors.red} />
          ) : null}
          <InputComponent
            type="default"
            value={workForm.description}
            onChange={val => handleChangeValue('description', val)}
            placeholder="Mô tả công việc"
            multiple
            numberOfLines={4}
            affix={
              <Edit2 size={20} color={appColors.gray} style={{marginTop: 22}} />
            }
            allowClear
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
              onSelect={val => handleChangeValue('assigned_at', val)}
              selected={workForm.assigned_at}
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
              onSelect={val => handleChangeValue('completed_at', val)}
              selected={workForm.completed_at}
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
  );
};

export default AddNewWorkScreen;
