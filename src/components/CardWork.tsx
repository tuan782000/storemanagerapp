import {Card, colors, DateTime, Row, Space} from '@bsdaoquang/rncomponent';
import {Calendar} from 'iconsax-react-native';
import React from 'react';
import {appInfos} from '../constants/appInfos';
import WorkSession from '../models/WorkSessionModel';
import TextComponent from './TextComponent';

interface Props {
  item: WorkSession;
}

const CardWork = (props: Props) => {
  const {item} = props;

  return (
    <Card
      styles={{
        width: appInfos.sizes.width * 0.7,
        maxWidth: 350,
      }}>
      <TextComponent text={item.description} />
      <Space height={12} />
      <Row>
        <Calendar size={20} color={colors.gray600} />
        <Space width={8} />
        <TextComponent
          text={DateTime.dateToDateString(item.maintenance_schedule)}
        />
      </Row>
    </Card>
  );
};

export default CardWork;
