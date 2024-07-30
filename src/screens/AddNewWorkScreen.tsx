import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {
  ContainerComponent,
  DateTimePickerComponent,
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
  Note,
  User,
} from 'iconsax-react-native';
import {appColors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';

const initialTask = {
  employee_id: '',
  customer_id: '',
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

const initialIcons = {
  employee_id: <User size={20} color={appColors.gray} />,
  customer_id: <User size={20} color={appColors.gray} />,
  description: <Note size={20} color={appColors.gray} />,
  assigned_at: <Calendar size={20} color={appColors.gray} />,
  completed_at: <CalendarTick size={20} color={appColors.gray} />,
};

const AddNewWorkScreen = () => {
  const [workForm, setWorkForm] = useState<any>(initialTask);
  const [errors, setErrors] = useState<any>(initialErrors);
  const icons: any = initialIcons;
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeValue = (key: string, value: string | Date) => {
    const data: any = {...workForm};
    data[`${key}`] = value;

    setWorkForm(data);
    // handleValidateInput(key, value);
  };

  //   const handleValidateInput = (key: string, value: string) => {
  //     const newErrors: any = {...errors};
  //     switch (key) {
  //       case 'employee_id':
  //         newErrors.customer_id =
  //           value.length < 6 ? 'Mật khẩu phải lớn hơn 6 ký tự' : '';
  //         break;

  //       case 'customer_id':
  //         newErrors.customer_id =
  //           value.length < 6 ? 'Mật khẩu phải lớn hơn 6 ký tự' : '';
  //         break;

  //       case 'description':
  //         newErrors.description =
  //           value.length < 10 ? 'Số ký tự phải lớn hơn 10' : '';
  //         break;

  //       case 'assigned_at':
  //         newErrors.assigned_at =
  //           value.length < 9 || value.length > 12
  //             ? 'Số điện thoại phải là 10 hoặc 11 số'
  //             : '';
  //         break;
  //       case 'completed_at':
  //         newErrors.completed_at =
  //           value.length < 9 || value.length > 12
  //             ? 'Số điện thoại phải là 10 hoặc 11 số'
  //             : '';
  //         break;

  //       default:
  //         break;
  //     }

  //     setErrors(newErrors);
  //   };

  const handleRegister = async () => {
    // if (Object.values(errors).some(error => error !== '')) {
    //   console.log('Có lỗi trong form'); // thay chỗ này bằng toast
    //   return;
    // }
    // setIsLoading(true);
    // if (
    //   userForm.email !== '' &&
    //   userForm.password !== '' &&
    //   userForm.name !== '' &&
    //   userForm.phone !== ''
    // ) {
    //   setErrors(initialErrors);
    //   try {
    //     const userSnapshot = await firestore()
    //       .collection('users')
    //       .where('email', '==', userForm.email)
    //       .get();
    //     if (!userSnapshot.empty) {
    //       let newErrors: any = {...errors};
    //       newErrors.email = 'Email đã được sử dụng. Vui lòng chọn email khác.';
    //       setErrors(newErrors);
    //       setIsLoading(false);
    //       return;
    //     }
    //     // Băm mật khẩu
    //     const hashedPassword = await bcrypt.hash(userForm.password, 10);
    //     // Tạo người dùng mới trong Firestore
    //     await firestore()
    //       .collection('users')
    //       .add({
    //         email: userForm.email,
    //         password: hashedPassword,
    //         username: extractUsernameFromEmail(userForm.email),
    //         role: UserRole.Employee,
    //         name: userForm.name,
    //         phone: userForm.phone,
    //         created_at: Date.now(),
    //         updated_at: Date.now(),
    //       });
    //     setUserForm(initialUser);
    //     Toast.show({
    //       type: 'success',
    //       text1: 'Thành công',
    //       text2: 'Đăng ký nhân viên thành công!!!',
    //       visibilityTime: 10000,
    //     });
    //     navigation.goBack();
    //   } catch (error: any) {
    //     Toast.show({
    //       type: 'error',
    //       text1: 'Thất bại',
    //       text2: error.message,
    //       visibilityTime: 10000,
    //     });
    //     console.log(error.message);
    //     // console.log(errors);
    //     // setErrors((prevErrors: any) => ({
    //     //   ...prevErrors,
    //     //   general: error.message, // or a specific error key if necessary
    //     // }));
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }
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
          <TextComponent
            text="Chọn nhân viên"
            size={16}
            font={fontFamilies.bold}
          />
          <SpaceComponent height={10} />

          <InputComponent value="" onChange={() => {}} />
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
            <TouchableOpacity>
              <AddCircle size={22} color={appColors.primary} />
            </TouchableOpacity>
          </RowComponent>
          <SpaceComponent height={10} />

          <InputComponent value="" onChange={() => {}} />
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

          <InputComponent
            value={workForm.description}
            onChange={val => handleChangeValue('description', val)}
            placeholder="Mô tả công việc"
            multible
            numberOfLines={4}
            allowClear
            styleInput={{
              paddingHorizontal: 0,
            }}
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
      </SectionComponent>
    </ContainerComponent>
  );
};

export default AddNewWorkScreen;
