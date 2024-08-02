import axiosClient from './axiosClient';

// liên quan tới authen thì gọi vào đây

export const handleAuthAPI = async (
  url: string,
  data?: any,
  method?: 'post' | 'put' | 'get' | 'delete',
) => {
  return await axiosClient(`/auth${url}`, {
    headers: {},
    method: method ?? 'get',
    data,
  });
};
