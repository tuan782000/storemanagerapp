import {View, Text, Image, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {UserModel} from '../../models/UserModel';
import firestore from '@react-native-firebase/firestore';
import {appColors} from '../../constants/colors';
import {globalStyles} from '../../styles/globalStyle';
import Octicons from 'react-native-vector-icons/Octicons';
import {fontFamilies} from '../../constants/fontFamilies';
import {DateTime} from '../../utils/DateTime';
import ButtonComponent from '../../components/ButtonComponent';
import {DeleteUserConfirmModal, EditAccountModal} from '../../modals';
import {HandleUserAPI} from '../../apis/handleUserAPI';
import Toast from 'react-native-toast-message';
import {formatCurrencyVNDWithText} from '../../utils/moneyFormatCurrency';

type EmployeeData = Pick<
  UserModel,
  `email` | `name` | `phone` | `profilePicture`
> & {
  id: string;
};

const StaffDetailScreen = ({navigation, route}: any) => {
  const {id} = route.params;

  const [infoUser, setInfoUser] = useState<EmployeeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleDeleteStaff, setIsVisibleDeleteStaff] = useState(false);
  const [isVisibleUpdateStaff, setIsVisibleUpdateStaff] = useState(false);
  const [totalMoney, setTotalMoney] = useState<number>(0);

  useEffect(() => {
    handleGetUserWithId(id);
    getTotalMoney(id);
  }, [id]);

  const handleGetUserWithId = async (id: string) => {
    setIsLoading(true);

    try {
      const api = `/info?id=${id}`;
      const userWithId = await HandleUserAPI.Info(api);

      if (userWithId) {
        const {email, name, phone, profilePicture} = userWithId.data;
        const userData: EmployeeData = {email, name, phone, profilePicture, id};
        setInfoUser(userData);
      } else {
        console.log('Không có thông tin liên quan!');
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //   console.log(infoUser);
  const getDisplayLabel = (key: string) => {
    switch (key) {
      case 'username':
        return 'Tên tài khoản';
      case 'role':
        return 'Vai trò';
      case 'email':
        return 'Email';
      case 'name':
        return 'Họ và tên';
      case 'created_at':
        return 'Ngày tham gia';
      case 'phone':
        return 'Số điện thoại';
      case 'updated_at':
        return 'Ngày thông tin được cập nhật';
      default:
        return key; // Hiển thị key gốc nếu không khớp với bất kỳ trường hợp nào
    }
  };

  const getTotalMoney = async (id: string) => {
    setIsLoading(true);

    try {
      const api = `/getMoneyUserEarn?id=${id}`;
      const total: any = await HandleUserAPI.Info(api);
      setTotalMoney(total.data); // này trả về object tham chiếu data lấy ra kết quả mình cần
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Có lỗi đã xảy ra',
        visibilityTime: 1000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContainerComponent back isScroll title="Thông tin chi tiết nhân viên">
      <SectionComponent>
        {isLoading ? (
          <ActivityIndicator />
        ) : infoUser ? (
          <>
            <View
              style={{
                borderRadius: 999,
                borderColor: appColors.primary,
                alignItems: 'center',
              }}>
              <Image
                source={
                  infoUser?.profilePicture
                    ? {
                        uri: infoUser?.profilePicture,
                      }
                    : require('../../assets/images/icon-logo.png')
                }
                style={{width: 160, height: 160, borderRadius: 999}}
                resizeMode="cover"
              />
              <SpaceComponent height={20} />
            </View>
            <View
              style={{
                alignItems: 'center',
              }}>
              <TextComponent
                text={`${formatCurrencyVNDWithText(totalMoney)}`}
                styles={{
                  backgroundColor: appColors.success,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
                color={appColors.white}
                font={fontFamilies.bold}
              />
            </View>
            <SpaceComponent height={20} />
            {Object.entries(infoUser)
              .filter(([key]) => key !== 'id' && key !== 'profilePicture')
              .map(([key, value]) => (
                <RowComponent
                  key={key}
                  styles={{
                    marginBottom: 8,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}>
                  <TextComponent
                    text={getDisplayLabel(key)}
                    size={16}
                    font={fontFamilies.bold}
                  />
                  {/* <TextComponent text={value} size={16} /> */}
                  <SpaceComponent height={10} />
                  <InputComponent
                    value={
                      key === 'created_at' || key === 'updated_at'
                        ? DateTime.timestampToVietnamDate(value)
                        : value
                    }
                    onChange={() => {}}
                    disabled={false}
                    styleInput={{backgroundColor: appColors.disabled}}
                  />
                </RowComponent>
              ))}
            <ButtonComponent
              text="Cập nhật thông tin nhân viên"
              onPress={() => setIsVisibleUpdateStaff(true)}
              type="primary"
              color={appColors.edit}
            />
            <SpaceComponent height={10} />
            <ButtonComponent
              text="Xoá nhân viên"
              onPress={() => setIsVisibleDeleteStaff(true)}
              type="primary"
              color={appColors.red}
            />
          </>
        ) : (
          <SectionComponent styles={[globalStyles.center, {flex: 1}]}>
            <Octicons name="inbox" size={38} color={appColors.gray3} />
            <TextComponent text="Trống" color={appColors.gray3} />
          </SectionComponent>
        )}
      </SectionComponent>
      <DeleteUserConfirmModal
        onClose={() => setIsVisibleDeleteStaff(!isVisibleDeleteStaff)}
        visible={isVisibleDeleteStaff}
        userId={id}
      />
      <EditAccountModal
        onClose={() => setIsVisibleUpdateStaff(!isVisibleUpdateStaff)}
        visible={isVisibleUpdateStaff}
        onUpdate={() => handleGetUserWithId(id)}
        name={infoUser?.name}
        phone={infoUser?.phone}
        userId={id}
      />
    </ContainerComponent>
  );
};

export default StaffDetailScreen;
