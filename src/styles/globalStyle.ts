import {StyleSheet} from 'react-native';
import {appColors} from '../constants/colors';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
