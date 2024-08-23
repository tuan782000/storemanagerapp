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
  const accesstoken = await getAccesstoken();
  config.headers = {
    Authorization: accesstoken ? `Bearer ${accesstoken}` : '',
    Accept: 'application/json',
    ...config.headers,
  };

  config.data;

  return config;
});

axiosClient.interceptors.response.use(
  res => {
    if (res.data && res.status >= 200 && res.status < 300) {
      return res.data;
    } else {
      return Promise.reject(res.data);
    }
  },
  error => {
    const {response} = error;
    // console.log(response);
    return Promise.reject(response.data);
  },
);

export default axiosClient;
