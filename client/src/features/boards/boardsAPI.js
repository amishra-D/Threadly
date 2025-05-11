import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getallboardsAPI = async () => {
    const res = await axios.get(`${BASE_URL}/boards/getallboards`, { withCredentials: true });
    console.log(res.data);
    return res.data;
  };
  