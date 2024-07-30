import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {
  ContainerComponent,
  SectionComponent,
  TextComponent,
} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';
import TabComponent, {TabButtonType} from '../../components/TabComponent';
import {TaskStatus} from '../../models/TasksModel';
import {appColors} from '../../constants/colors';
import {Add} from 'iconsax-react-native';

const WorkScreen = ({navigation}: any) => {
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
    <>
      <ContainerComponent isScroll>
        <SectionComponent>
          <TextComponent
            text="Quản lý đơn hàng"
            title
            font={fontFamilies.bold}
          />
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
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('AddNewWorkScreen')}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 20,
          paddingHorizontal: 20,
          backgroundColor: appColors.primary,
          borderRadius: 100,
        }}>
        <Add size={30} color={appColors.white} />
      </TouchableOpacity>
    </>
  );
};

export default WorkScreen;
