import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {
  ContainerComponent,
  SectionComponent,
  TextComponent,
} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';
import TabComponent, {TabButtonType} from '../../components/TabComponent';
import {TaskStatus} from '../../models/TasksModel';

const WorkScreen = () => {
  const [selectedTab, setSelectedTab] = useState<TaskStatus>(
    TaskStatus.Pending,
  );
  const buttons: TabButtonType[] = [
    {
      title: 'Đang xử lý',
    },
    {
      title: 'Hoàn thành',
    },
  ];
  return (
    <ContainerComponent isScroll>
      <SectionComponent>
        <TextComponent text="Quản lý đơn hàng" title font={fontFamilies.bold} />
      </SectionComponent>
      <SectionComponent>
        <TabComponent
          buttons={buttons}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </SectionComponent>
      <SectionComponent>
        <View style={{flex: 1, alignItems: 'center'}}>
          {selectedTab === TaskStatus.Pending ? (
            <>
              <TextComponent text="Tab 1" />
            </>
          ) : (
            <>
              <TextComponent text="Tab 2" />
            </>
          )}
        </View>
      </SectionComponent>
    </ContainerComponent>
  );
};

export default WorkScreen;
