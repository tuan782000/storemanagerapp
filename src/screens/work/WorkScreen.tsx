import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  CardComponent,
  ContainerComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';
import TabComponent, {TabButtonType} from '../../components/TabComponent';
import {TaskStatus, TasksModel} from '../../models/TasksModel';
import {appColors} from '../../constants/colors';
import {Add} from 'iconsax-react-native';
import firestore from '@react-native-firebase/firestore';
import DividerComponent from '../../components/DividerComponent';
import {getLastSevenCharacters} from '../../utils/getLastSevenCharacters';
import {DateTime} from '../../utils/DateTime';

const WorkScreen = ({navigation}: any) => {
  const [selectedTab, setSelectedTab] = useState<TaskStatus>(
    TaskStatus.Pending,
  );

  const [pendingTasks, setPendingTasks] = useState<TasksModel[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TasksModel[]>([]);

  const buttons: TabButtonType[] = [
    {
      title: 'Đang xử lý',
    },
    {
      title: 'Hoàn thành',
    },
  ];

  useEffect(() => {
    // Lắng nghe sự kiện khi màn hình được focus
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTasks(TaskStatus.Pending);
      fetchTasks(TaskStatus.Completed);
    });

    // Dọn dẹp listener khi component bị unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchTasks(TaskStatus.Pending);
    fetchTasks(TaskStatus.Completed);
  }, []);

  const fetchTasks = async (status: TaskStatus) => {
    try {
      const snapshot = await firestore()
        .collection('works')
        .where('status', '==', status)
        .get();

      const tasks: TasksModel[] = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (status === TaskStatus.Pending) {
        setPendingTasks(tasks);
      } else if (status === TaskStatus.Completed) {
        setCompletedTasks(tasks);
      }
    } catch (error: any) {
      console.error('Error fetching tasks: ', error);
    }
  };

  const renderItem = ({item}: any) => (
    <CardComponent>
      <RowComponent>
        <TextComponent text="Mã số nhiệm vụ: " />
        <TextComponent text={getLastSevenCharacters(item.id)} />
      </RowComponent>
      <SpaceComponent height={10} />
      <DividerComponent />
      <SpaceComponent height={10} />
      <RowComponent styles={{alignItems: 'flex-start'}}>
        <RowComponent
          styles={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
          <TextComponent text="Mô tả nhiệm vụ: " />
          <TextComponent
            text={`- ${item.description}`}
            styles={{flex: 0, flexWrap: 'wrap'}}
          />
          <RowComponent>
            <TextComponent text="Trạng thái: " />
            <TextComponent
              text={`${item.status === 0 ? 'Đang xử lý' : ''}`}
              color={appColors.warning}
              font={fontFamilies.bold}
            />
          </RowComponent>
          <RowComponent>
            <TextComponent text="Ngày bắt đầu: " />
            {item.assigned_at && (
              <TextComponent
                text={`${DateTime.timestampToVietnamDate(item.assigned_at)}`}
              />
            )}
          </RowComponent>
          <RowComponent>
            <TextComponent text="Dự kiến hoàn thành: " />
            {item.completed_at && (
              <TextComponent
                text={`${DateTime.timestampToVietnamDate(item.completed_at)}`}
              />
            )}
          </RowComponent>
        </RowComponent>
      </RowComponent>
    </CardComponent>
  );

  return (
    <>
      <ContainerComponent>
        <SectionComponent
          styles={{
            marginTop: 10,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            paddingBottom: 0,
          }}>
          <TextComponent
            text="Quản lý đơn hàng"
            title
            font={fontFamilies.bold}
          />
        </SectionComponent>
        <SpaceComponent height={20} />

        <SectionComponent>
          <TabComponent
            buttons={buttons}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </SectionComponent>
        <SectionComponent>
          <FlatList
            data={
              selectedTab === TaskStatus.Pending ? pendingTasks : completedTasks
            }
            renderItem={renderItem}
            // keyExtractor={(item) => item.id}
          />
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
