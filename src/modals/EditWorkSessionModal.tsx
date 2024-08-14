import {View, Text, Modal, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {globalStyles} from '../styles/globalStyle';
import {
  InputComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../components';
import {fontFamilies} from '../constants/fontFamilies';
import {CloseCircle, Money2} from 'iconsax-react-native';
import {appColors} from '../constants/colors';
import ButtonComponent from '../components/ButtonComponent';
import {HandleWorkSessionAPI} from '../apis/handleWorkSessionAPI';
import Toast from 'react-native-toast-message';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  amount: number;
  payment_amount: number;
  workId: string;
  onUpdate: () => void;
}

const EditWorkSessionModal = (props: Props) => {
  const {onClose, visible, title, amount, payment_amount, workId, onUpdate} =
    props;

  console.log(amount, payment_amount);

  const calcPaymentAmount =
    payment_amount && amount ? (payment_amount * 100) / amount : 0;

  const initialValue = {
    amount: amount,
    payment_amount: calcPaymentAmount,
  };

  const initialErrors = {
    amount: '',
    payment_amount: '',
  };

  const [values, setValues] = useState(initialValue);
  const [errors, setErrors] = useState(initialErrors);
  const [isLoading, setisLoading] = useState(false);

  const handleChangeValue = (
    key: string,
    value: string | string[] | number | Date,
  ) => {
    const data: any = {...values};

    if (typeof value === 'string') {
      value = isNaN(Number(value)) ? value : Number(value);
    }

    data[`${key}`] = value;

    setValues(data);
    handleValidateInput(key, value);
  };

  const handleValidateInput = (
    key: string,
    value: string | string[] | number | Date,
  ) => {
    const newErrors = {...errors};

    switch (key) {
      case 'amount':
        if (typeof value === 'number') {
          newErrors.amount = value > 0 ? '' : 'Không được nhập số âm';
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
      // case 'start_time':
      //   if (!(value instanceof Date)) {
      //     newErrors.start_time = 'Không đúng định dạng ngày tháng';
      //   }
      //   break;
      // case 'end_time':
      //   if (!(value instanceof Date)) {
      //     newErrors.end_time = 'Không đúng định dạng ngày tháng';
      //   }
      //   break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleEditWorkSession = async (id: string) => {
    if (
      values.amount &&
      values.amount > 0 &&
      values.payment_amount &&
      values.payment_amount > 0 &&
      values.payment_amount < 100
    ) {
      setErrors(initialErrors);
      setisLoading(true);
      const api = `/updateWorkSessionByAdmin?id=${id}`;
      try {
        await HandleWorkSessionAPI.WorkSession(
          api,
          {
            amount: values.amount,
            payment_amount: values.payment_amount,
          },
          'put',
        );
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Cập nhật công việc thành công!!!',
          visibilityTime: 1000,
        });
        onUpdate();
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Thất bại',
          text2: error.message,
          visibilityTime: 10000,
        });
      } finally {
        setisLoading(false);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      style={[globalStyles.center, {flex: 1}]}
      transparent
      statusBarTranslucent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
        }}>
        <View
          style={{
            margin: 20,
            padding: 20,
            borderRadius: 12,
            backgroundColor: 'white',
          }}>
          <RowComponent justify="space-between" styles={{alignItems: 'center'}}>
            <TextComponent
              text={title ? title : 'Chỉnh Sửa'}
              size={20}
              font={fontFamilies.bold}
            />
            <TouchableOpacity onPress={() => onClose()}>
              <CloseCircle size={22} color={appColors.gray} />
            </TouchableOpacity>
          </RowComponent>
          <SpaceComponent height={20} />
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
              <TextComponent text={errors['amount']} color={appColors.red} />
            ) : null}
            <InputComponent
              type="numeric"
              value={`${values.amount}`}
              onChange={val => handleChangeValue('amount', val)}
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
              <TextComponent
                text={errors['payment_amount']}
                color={appColors.red}
              />
            ) : null}
            <InputComponent
              type="numeric"
              value={`${values.payment_amount}`}
              onChange={val => handleChangeValue('payment_amount', val)}
              placeholder="Vui lòng nhập số phần trăm"
              affix={<Money2 size={20} color={appColors.gray} />}
            />
          </RowComponent>
          <ButtonComponent
            isLoading={isLoading}
            text="Cập nhật công việc"
            type="primary"
            color={appColors.edit}
            onPress={() => handleEditWorkSession(workId)}
          />
        </View>
      </View>
    </Modal>
  );
};

export default EditWorkSessionModal;
