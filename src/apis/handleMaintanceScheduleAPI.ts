import axiosClient from './axiosClient';

const handleMaintanceScheduleAPI = async (
  url: string,
  data?: any,
  method?: 'post' | 'put' | 'get' | 'delete',
) => {
  return await axiosClient(url, {
    method: method ?? 'get',
    data,
  });
};

export class HandleMaintanceScheduleAPI {
  static MaintanceSchedule = (
    url: string,
    data?: any,
    method?: 'post' | 'put' | 'get' | 'delete',
  ) =>
    handleMaintanceScheduleAPI(
      `/maintenanceSchedule${url}`,
      data,
      method ?? 'get',
    );
}
