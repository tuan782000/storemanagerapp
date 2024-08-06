import axiosClient from './axiosClient';

const handleUserAPI = async (
  url: string,
  data?: any,
  method?: 'post' | 'put' | 'get' | 'delete',
) => {
  return await axiosClient(url, {
    method: method ?? 'get',
    data,
  });
};

export class HandleUserAPI {
  static Info = (
    url: string,
    data?: any,
    method?: 'post' | 'put' | 'get' | 'delete',
  ) => handleUserAPI(`/user${url}`, data, method ?? 'get');
}
