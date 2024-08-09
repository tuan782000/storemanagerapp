import axiosClient from './axiosClient';

const handleWorkSessionAPI = async (
  url: string,
  data?: any,
  method?: 'post' | 'put' | 'get' | 'delete',
) => {
  return await axiosClient(url, {
    method: method ?? 'get',
    data,
  });
};

export class HandleWorkSessionAPI {
  static WorkSession = (
    url: string,
    data?: any,
    method?: 'post' | 'put' | 'get' | 'delete',
  ) => handleWorkSessionAPI(`/worksession${url}`, data, method ?? 'get');
}
