import {Dimensions} from 'react-native';

export const appInfos = {
  sizes: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  BASE_URL: 'http://192.168.1.6:7820',
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
};
