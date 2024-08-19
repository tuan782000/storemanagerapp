import axios from 'axios';
import queryString from 'query-string';
import {appInfos} from '../constants/appInfos';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAccesstoken = async () => {
  const res = await AsyncStorage.getItem('auth');

  const data = res ? JSON.parse(res).accesstoken : '';

  return data;
};

const axiosClient = axios.create({
  paramsSerializer: params => queryString.stringify(params),
  baseURL: appInfos.BASE_URL,
});

axiosClient.interceptors.request.use(async (config: any) => {
  config.headers = {
    Authorization: `Bearer ${await getAccesstoken()}`,
    Accept: 'application/json',
    ...config.headers,
  };

  config.data;

  return config;
});

axiosClient.interceptors.response.use(
  response => {
    if (response.status >= 200 && response.status < 300 && response.data) {
      return response.data;
    }
  },
  error => {
    console.log(error);
    console.log(error.response.data.message);
    throw new Error(error.message);
  },
);

export default axiosClient;
