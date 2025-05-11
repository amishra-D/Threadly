import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getyouruserAPI = async () => {
  const res = await axios.get(`${BASE_URL}/profile/getyourprofile`, {
    withCredentials: true,
  });
  return res.data;
};
export const updateuserAPI = async (data) => {
  const res = await axios.put(`${BASE_URL}/profile/updateprofile`, data, {
    withCredentials: true,
    
  });
  return res.data;
};

export const getuserprofileAPI = async ( username ) => {
  const res = await axios.get(`${BASE_URL}/profile/getuserprofile/${username}`, {
    withCredentials: true,
  });
  console.log("Fetched from server:", res.data);
  return res.data;
};

export const getpostsAPI = async () => {
  const res = await axios.get(`${BASE_URL}/profile/getposts`, {
    withCredentials: true,
  });
  return res.data.posts;
};

export const addbookmarkAPI = async ({postId}) => {
  const res = await axios.post(`${BASE_URL}/profile/addbookmark/${postId}`, null, {
    withCredentials: true,
  });
    console.log("from api",res.data)
  return res.data;
};

export const removebookmarkAPI = async ({postId}) => {
  const res = await axios.post(`${BASE_URL}/profile/removebookmark/${postId}`, null, {
    withCredentials: true,
  });
  return res.data;
};

export const getbookmarkAPI = async () => {
  const res = await axios.get(`${BASE_URL}/profile/getbookmarks`, {
    withCredentials: true,
  });
  return res.data.bookmarks;
};
export const searchuserAPI = async (input) => {
  try {
    console.log("In api call",input);
    const res = await axios.get(`${BASE_URL}/profile/searchuser/${input}`, {
      
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
export const deleteuserAPI=async(id)=>{
  try{
    const res = await axios.delete(`${BASE_URL}/profile/deleteaccount`,{
            params:{id},
            withCredentials:true,
  });
  return res.data;
  }
  catch(error){
    condole.log(error);
    throw error;
  }
}
export const getallusersAPI =async()=>{
  try{
        console.log('fetching....');
    const res = await axios.get(`${BASE_URL}/profile/getallusers`,{
      withCredentials:true
      });
                console.log('fetched....',res);
      return res.data.users;

    }
    catch(error){
      console.log(error);
      throw error;
    }
}