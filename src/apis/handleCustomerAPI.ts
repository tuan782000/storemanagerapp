import axiosClient from './axiosClient';

const handleCustomerAPI = async (
  url: string,
  data?: any,
  method?: 'post' | 'put' | 'get' | 'delete',
) => {
  return await axiosClient(url, {
    method: method ?? 'get',
    data,
  });
};

export class HandleCustomerAPI {
  static Customer = (
    url: string,
    data?: any,
    method?: 'post' | 'put' | 'get' | 'delete',
  ) => handleCustomerAPI(`/customer${url}`, data, method ?? 'get');
}
