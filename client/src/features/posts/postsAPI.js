import { axiosinstance } from "@/utils/axios";

export const getAllPostsAPI = async (params = {}) => {
  const { boardId, sort, page = 1 } = params;
  const res = await axiosinstance.get(`/posts/getallposts`, {
    params: { boardId, sort, page, limit: 10 },
    withCredentials: true,
  });
  return res.data;
};

export const createTextPostAPI = async ({ boardId, data }) => {
  const res = await axiosinstance.post(`/posts/createtextpost/${boardId}`, data, {
    withCredentials: true
  });
  console.log("Frontend API", res);
  return res.data;
};

export const uploadImagePostAPI = async ({ boardId, formData }) => {
  const res = await axiosinstance.post(`/posts/imgupload/${boardId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true
  });
  return res.data;
};

export const uploadVideoPostAPI = async ({ boardId, formData }) => {
  const res = await axiosinstance.post(`/posts/vidupload/${boardId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params: { boardId },
    withCredentials: true
  });
  return res.data;
};

export const deletePostAPI = async (postId) => {
  const res = await axiosinstance.delete(`/posts/deletepost/${postId}`, {
    withCredentials: true
  });
  return res.data;
};

export const addlikeAPI = async (postId) => {
  console.log("api called");
  const res = await axiosinstance.post(`/like-dislike/likepost/${postId}`, null, {
    params: { postId },
    withCredentials: true
  });
  return res.data.post;
};

export const adddislikeAPI = async (postId) => {
  const res = await axiosinstance.post(`/like-dislike/dislikepost/${postId}`, null, {
    params: { postId },
    withCredentials: true
  });
  return res.data.post;
};

export const addreportAPI = async ({ type, contentId, reason }) => {
  console.log(type, contentId, reason);
  const res = await axiosinstance.post(
    `/report/addreport/${contentId}`,
    { reason, type },
    { withCredentials: true }
  );
  return res.data;
};

export const getallreportsAPI = async () => {
  const res = await axiosinstance.get(`/report/getallreports`, {
    withCredentials: true
  });
  return res.data;
};

export const deletereportAPI = async ({ contentId }) => {
  const res = await axiosinstance.delete(`/report/deletereport/${contentId}`, {
    withCredentials: true
  });
  return res.data;
};