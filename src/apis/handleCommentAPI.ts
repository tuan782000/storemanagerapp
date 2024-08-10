import axiosClient from './axiosClient';

const handleCommentAPI = async (
  url: string,
  data?: any,
  method?: 'post' | 'put' | 'get' | 'delete',
) => {
  return await axiosClient(url, {
    method: method ?? 'get',
    data,
  });
};

export class HandleCommentAPI {
  static Comment = (
    url: string,
    data?: any,
    method?: 'post' | 'put' | 'get' | 'delete',
  ) => handleCommentAPI(`/comment${url}`, data, method ?? 'get');
}
