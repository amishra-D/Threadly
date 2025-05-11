import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllPostsAPI = async (params = {}) => {
  const { boardId, sort } = params;
  const res = await axios.get(`${BASE_URL}/posts/getallposts`, {
    params: { boardId, sort },
    withCredentials: true,
  });
  return res.data.posts;
  
};


export const createTextPostAPI = async ({ boardId, data }) => {
  const res = await axios.post(`${BASE_URL}/posts/createpost/${boardId}`, data, {
    withCredentials: true
  });
  console.log("Frontend API",res)
  return res.data;
};


export const uploadImagePostAPI = async ({ boardId, formData }) => {
  const res = await axios.post(`${BASE_URL}/posts/createpostimage/${boardId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params: { boardId},
    withCredentials: true

  });
  return res.data;
};

export const uploadVideoPostAPI = async ({ boardId, formData }) => {
  const res = await axios.post(`${BASE_URL}/posts/createpostvideo/${boardId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params: { boardId},
    withCredentials: true

  });
  return res.data;
};

export const deletePostAPI = async (postId) => {
  const res = await axios.delete(`${BASE_URL}/posts/deletepost/${postId}`,{
    withCredentials: true
  });
  return res.data;
};
export const addlikeAPI=async(postId)=> {
  const res = await axios.post(`${BASE_URL}like-dislike/likepost/${postId}`,null,{
    params: { postId},
    withCredentials: true
  });
  return res.data.post;
};
export const addreportAPI = async ({ type, contentId, reason }) => {
  console.log(type,contentId,reason)
  const res = await axios.post(
    `${BASE_URL}/report/addreport/${contentId}`,
    { reason, type },
    { withCredentials: true }
  );
  return res.data;
};

export const adddislikeAPI=async(postId)=> {
  const res = await axios.post(`${BASE_URL}/like-dislike/dislikepost/${postId}`,null,{
    params: { postId},
    withCredentials: true
  });
  return res.data.post;
};
export const getallreportsAPI=async()=>{
  const res = await axios.get(`${BASE_URL}/report/getreport`,{
    withCredentials:true
    });
    return res.data;
}
export const deletereportAPI=async({contentId})=>{
  const res = await axios.delete(`${BASE_URL}/report/deletereport/${contentId}`,{
    withCredentials:true
    });
    return res.data;
}