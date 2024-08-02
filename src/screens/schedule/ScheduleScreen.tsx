import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {
  ContainerComponent,
  SectionComponent,
  TextComponent,
} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';
// import {TaskStatus} from '../../models/TasksModel';
// import TabComponent, {TabButtonType} from '../../components/TabComponent';

const ScheduleScreen = () => {
  // const [selectedTab, setSelectedTab] = useState<TaskStatus>();
  // const buttons: TabButtonType[] = [
  //   {
  //     title: 'Tab 1',
  //   },
  //   {
  //     title: 'Tab 2',
  //   },
  // ];
  return (
    <ContainerComponent isScroll>
      <SectionComponent>
        <TextComponent
          text="Quản lý lịch bảo trì"
          title
          font={fontFamilies.bold}
        />
      </SectionComponent>
      {/* <SectionComponent>
        <TabComponent />
      </SectionComponent> */}
    </ContainerComponent>
  );
};

export default ScheduleScreen;
