import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  ContainerComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';
import ButtonComponent from '../../components/ButtonComponent';
import {appColors} from '../../constants/colors';
import DividerComponent from '../../components/DividerComponent';
import {Add, AddSquare} from 'iconsax-react-native';
import {globalStyles} from '../../styles/globalStyle';

const StaffScreen = ({navigation}: any) => {
  return (
    <>
      <ContainerComponent isScroll>
        <SectionComponent styles={{marginTop: 10}}>
          <RowComponent justify="space-between">
            <TextComponent
              text="Quản lý nhân viên"
              title
              font={fontFamilies.bold}
            />
            {/* <ButtonComponent
            text="Thêm thợ"
            icon={<AddSquare size={22} color={appColors.white} />}
            iconPostion="left"
            color={appColors.edit}
            // onPress={() => setIsVisibleEditModal(true)}
            onPress={() => console.log('Thêm mới user')}
            type="primary"
            activeOpacity={0.9}
            styles={{
              paddingHorizontal: 10,
              minHeight: 0,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          /> */}
          </RowComponent>
        </SectionComponent>
        <DividerComponent />
      </ContainerComponent>
      {/* <SectionComponent
        styles={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ButtonComponent
          text="Thêm mới nhân viên"
          // icon={<AddSquare size={22} color={appColors.white} />}
          // iconPostion="left"
          color={appColors.success}
          // onPress={() => setIsVisibleEditModal(true)}
          onPress={() => console.log('Thêm mới user')}
          type="primary"
          activeOpacity={0.9}
          styles={{
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 10,
          }}
        />
      </SectionComponent> */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddNewUserScreen')}
          activeOpacity={0.9}
          style={[
            globalStyles.row,
            {
              backgroundColor: appColors.primary,
              width: '90%',
              borderRadius: 10,
              padding: 10,
            },
          ]}>
          <TextComponent
            text="Add new task"
            flex={1}
            color={appColors.white}
            styles={{textAlign: 'center'}}
            font={fontFamilies.medium}
          />
          <Add size={22} color={appColors.white} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default StaffScreen;
