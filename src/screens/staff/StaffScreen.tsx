import {View, Text} from 'react-native';
import React from 'react';
import {
  ContainerComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';

const StaffScreen = () => {
  return (
    <ContainerComponent isScroll>
      <SectionComponent>
        <RowComponent justify="space-between">
          <TextComponent
            text="Quản lý nhân viên"
            title
            font={fontFamilies.bold}
          />
        </RowComponent>
      </SectionComponent>
    </ContainerComponent>
  );
};

export default StaffScreen;
