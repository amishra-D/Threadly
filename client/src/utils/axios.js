import axios from 'axios'
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const axiosinstance = axios.create({
  baseURL: `${BASE_URL}`,
});
axiosinstance.interceptors.request.use(function (config) {
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

axiosinstance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
if(error.response.status===401)
    window.location.href='/auth'
    return Promise.reject(error);
  });