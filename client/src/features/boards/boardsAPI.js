import { axiosinstance } from '@/utils/axios';

export const getallboardsAPI = async () => {
    const res = await axiosinstance.get(`/boards/getallboards`, { withCredentials: true });
    console.log(res.data);
    return res.data;
  };
  