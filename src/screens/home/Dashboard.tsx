import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Container from '../../components/Container';
import {
  Col,
  colors,
  Row,
  Section,
  Space,
  Tabbar,
} from '@bsdaoquang/rncomponent';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {TextComponent} from '../../components';
import {UserModel} from '../../models/UserModel';
import {fontFamilies} from '../../constants/fontFamilies';
import {globalStyles} from '../../styles/globalStyle';
import {SearchNormal1, User} from 'iconsax-react-native';
import Schedulers from './components/Schedulers';

const Dashboard = ({navigation}: any) => {
  const auth: UserModel = useSelector(authSelector);

  return (
    <Container isScroll>
      <Section>
        <Row>
          <Col>
            <TextComponent text={'Welcome back!'} size={12} />
            <TextComponent text={auth.name} font={fontFamilies.bold} />
          </Col>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')}>
            {auth.profilePicture ? (
              <Image
                source={{uri: auth.profilePicture}}
                style={[
                  globalStyles.avatar,
                  {
                    resizeMode: 'cover',
                  },
                ]}
              />
            ) : (
              <View style={[globalStyles.avatar]}>
                <User size={24} color={colors.white} />
              </View>
            )}
          </TouchableOpacity>
        </Row>
      </Section>
      <Section>
        <Row
          styles={[globalStyles.inputContainer, {marginBottom: 0}]}
          onPress={() => navigation.navigate('SearchScreen')}>
          <SearchNormal1 size={20} color={colors.gray600} />
          <Space width={8} />
          <Col>
            <TextComponent
              text="Tìm kiếm nhân viên, khách hàng, công việc..."
              size={12}
              color={colors.gray500}
            />
          </Col>
        </Row>
      </Section>
      <Schedulers />
    </Container>
  );
};

export default Dashboard;
