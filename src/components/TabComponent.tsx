import {View, Text, Pressable, LayoutChangeEvent} from 'react-native';
import React, {useEffect, useState} from 'react';
import TextComponent from './TextComponent';
import {fontFamilies} from '../constants/fontFamilies';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {appColors} from '../constants/colors';

export type TabButtonType = {
  title: string;
};

interface Props {
  buttons: TabButtonType[];
  selectedTab: number;
  setSelectedTab: (index: number) => void;
}

const TabComponent = (props: Props) => {
  const {buttons, selectedTab, setSelectedTab} = props;

  const [dimensions, setDimensions] = useState({height: 20, width: 100});
  const buttonWidth = dimensions.width / buttons.length;
  const tabPositionX = useSharedValue(0);

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const handlePress = (index: number) => {
    setSelectedTab(index);
  };
  const onTabPress = (index: number) => {
    tabPositionX.value = withTiming(buttonWidth * index, {}, () => {
      runOnJS(handlePress)(index);
    });
  };
  const animtedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: tabPositionX.value}],
    };
  });

  return (
    <View
      accessibilityRole="tablist"
      style={{
        backgroundColor: appColors.gray5,
        borderRadius: 20,
        justifyContent: 'center',
      }}>
      <Animated.View
        style={[
          animtedStyle,
          {
            position: 'absolute',
            backgroundColor: appColors.primary,
            borderRadius: 15,
            marginHorizontal: 5,
            height: dimensions.height - 10,
            width: buttonWidth - 10,
          },
        ]}
      />
      <View onLayout={onTabbarLayout} style={{flexDirection: 'row'}}>
        {buttons.map((button, index) => {
          const color =
            selectedTab === index ? appColors.white : appColors.tabText;
          return (
            <Pressable
              key={index}
              onPress={() => onTabPress(index)}
              style={{flex: 1, paddingVertical: 20}}>
              <TextComponent
                text={button.title}
                color={color}
                font={fontFamilies.bold}
                styles={{alignSelf: 'center'}}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default TabComponent;
