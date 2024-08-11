import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {
  ContainerComponent,
  DateTimePickerComponent,
  InputComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../components';
import {fontFamilies} from '../constants/fontFamilies';
import {appColors} from '../constants/colors';
import {Edit2} from 'iconsax-react-native';
import ButtonComponent from '../components/ButtonComponent';
import Toast from 'react-native-toast-message';
import {HandleMaintanceScheduleAPI} from '../apis/handleMaintanceScheduleAPI';

const initialSchedule = {
  employee_id: '',
  customer_id: '',
  work_session_id: '',
  scheduled_date: Date.now(),
  notes: '',
};

const initialErrors = {
  scheduled_date: '',
  notes: '',
};

const AddNewScheduleScreen = ({navigation, route}: any) => {
  const {workSessionId, employeeId, customerId} = route.params;
  //   console.log(workSessionId, employeeId, customerId);
  const [scheduleForm, setScheduleForm] = useState<any>(initialSchedule);
  const [errors, setErrors] = useState<any>(initialErrors);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeValue = (key: string, value: string | Date) => {
    const data: any = {...scheduleForm};
    data[`${key}`] = value;
    setScheduleForm(data);
    handleValidateInput(key, value);
  };

  const handleValidateInput = (key: string, value: string | Date) => {
    const newErrors: any = {...errors};
    switch (key) {
      // case 'scheduled_date':

      //     break;

      case 'notes':
        if (typeof value === 'string') {
          newErrors.notes =
            value.length < 10 ? 'Ghi chú công việc phải lớn hơn 10 ký tự' : '';
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
    if (scheduleForm.notes === '') {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        notes: 'Phải ghi chú công việc bảo trì rõ ràng',
      }));
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Phải ghi chú công việc bảo trì rõ ràng',
        visibilityTime: 1000,
      });
      return;
    }
    setIsLoading(true);

    if (scheduleForm.notes !== '') {
      setErrors(initialErrors);
      try {
        const api = '/createMaintenanceSchedule';
        await HandleMaintanceScheduleAPI.MaintanceSchedule(
          api,
          {
            employee_id: employeeId,
            customer_id: customerId,
            work_session_id: workSessionId,
            scheduled_date: scheduleForm.scheduled_date,
            notes: scheduleForm.notes,
          },
          'post',
        );
        setScheduleForm(initialSchedule);
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Đăng ký lịch bảo trì thành công!!!',
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
    <ContainerComponent back isScroll title="Tạo lịch bảo trì">
      <SectionComponent>
        <TextComponent
          text="Chọn ngày bảo trì"
          size={16}
          font={fontFamilies.bold}
        />
        <SpaceComponent height={10} />
        <DateTimePickerComponent
          type="date"
          onSelect={val => handleChangeValue('scheduled_date', val)}
          selected={scheduleForm.scheduled_date}
        />
        <TextComponent
          text="Ghi chú bảo trì"
          size={16}
          font={fontFamilies.bold}
        />
        <SpaceComponent height={10} />
        {errors['notes'] ? (
          <>
            <TextComponent text={errors['notes']} color={appColors.red} />
            <SpaceComponent height={10} />
          </>
        ) : null}
        <InputComponent
          type="default"
          value={scheduleForm.notes}
          onChange={val => handleChangeValue('notes', val)}
          placeholder="Ghi chú công việc bảo trì"
          multiple
          numberOfLines={4}
          affix={
            <Edit2 size={20} color={appColors.gray} style={{marginTop: 22}} />
          }
          allowClear
        />
        <ButtonComponent
          text="Tạo lịch bảo trì"
          type="primary"
          onPress={handleRegister}
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default AddNewScheduleScreen;
