import {colors, Row, Section, Tabbar} from '@bsdaoquang/rncomponent';
import {useNavigation} from '@react-navigation/native';
import {ArrowRight} from 'iconsax-react-native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import {HandleAPI} from '../../../apis/handleAPI';
import {TextComponent} from '../../../components';
import WorkSession from '../../../models/WorkSessionModel';
import {appInfos} from '../../../constants/appInfos';
import {add0ToNumber} from '../../../utils/add0ToNumber';
import {fontFamilies} from '../../../constants/fontFamilies';
import {appColors} from '../../../constants/colors';
import CardWork from '../../../components/CardWork';

const now = moment();

const Schedulers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [works, setWorks] = useState<WorkSession[]>([]);
  const [dayOfWeeks, setDayOfWeeks] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString());

  const navigation: any = useNavigation();

  useEffect(() => {
    getMaintenances();
  }, [selectedDay]);

  useEffect(() => {
    const items: string[] = [];
    for (let i = 0; i < 7; i++) {
      items.push(now.clone().weekday(i).toISOString());
    }

    setDayOfWeeks(items);
  }, []);

  const getMaintenances = async () => {
    const api = `/worksession/maintenances?date=${selectedDay}&limit=10`;

    setIsLoading(true);
    try {
      const res = await HandleAPI(api);
      res.data && setWorks(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDay = (item: string, index: number) => {
    const val = item.split('T')[0];
    const date = selectedDay.split('T')[0];
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedDay(item);
        }}
        key={`itemDay${index}`}
        style={[
          {
            paddingVertical: 4,
            paddingHorizontal: 8,
            width: (appInfos.sizes.width - 32) / 8,
            backgroundColor: appColors.white,
            borderRadius: 8,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: date === val ? colors.success : colors.gray300,
          },
        ]}>
        <TextComponent
          flex={0}
          text={index === 0 ? 'CN' : `T${index + 1}`}
          color={date === val ? colors.success : colors.gray500}
          size={12}
        />
        <TextComponent
          text={add0ToNumber(new Date(item).getDate()).toString()}
          color={date === val ? colors.success : colors.gray700}
          font={fontFamilies.bold}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Section>
        <Tabbar
          title="Lịch hẹn trong ngày"
          renderSeemore={<ArrowRight size={22} color={colors.primary} />}
          onSeeMore={() => navigation.navigate('ScheduleTab')}
        />

        <Row justifyContent="space-between">
          {dayOfWeeks.length > 0 &&
            dayOfWeeks.map((item, index) => renderDay(item, index))}
        </Row>
      </Section>

      {isLoading ? (
        <ActivityIndicator color={colors.gray400} />
      ) : works.length > 0 ? (
        <FlatList
          horizontal
          showsVerticalScrollIndicator={false}
          data={works}
          renderItem={({item}) => <CardWork item={item} key={item._id} />}
        />
      ) : (
        <Section styles={{justifyContent: 'center', alignItems: 'center'}}>
          <TextComponent
            size={12}
            color={colors.gray700}
            text="Không có lịch hẹn bảo trì"
          />
        </Section>
      )}
    </View>
  );
};

export default Schedulers;
