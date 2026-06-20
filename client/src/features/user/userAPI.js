import { axiosinstance } from "@/utils/axios";
export const getyouruserAPI = async () => {
  const res = await axiosinstance.get(`/profile/getyourprofile`, {
    withCredentials: true,
  });
  return res.data;
};
export const updateuserAPI = async (data) => {
  const res = await axiosinstance.put(`/profile/updateprofile`, data, {
    withCredentials: true,
    
  });
  return res.data;
};

export const getuserprofileAPI = async ( data ) => {
  console.log("api called",data);
  
  const res = await axiosinstance.get(`/profile/getuserprofile/${data.username}`, {
    withCredentials: true,
  });
  console.log("Fetched from server:", res.data);
  return res.data;
};

export const getpostsAPI = async () => {
  const res = await axiosinstance.get(`/profile/getposts`, {
    withCredentials: true,
  });
  return res.data.posts;
};

export const addbookmarkAPI = async ({postId}) => {
  const res = await axiosinstance.post(`/profile/addBookmark/${postId}`, null, {
    withCredentials: true,
  });
    console.log("from api",res.data)
  return res.data;
};

export const removebookmarkAPI = async ({postId}) => {
  const res = await axiosinstance.post(`/profile/removeBookmark/${postId}`, null, {
    withCredentials: true,
  });
  return res.data;
};

export const getbookmarkAPI = async () => {
  const res = await axiosinstance.get(`/profile/getbookmarks`, {
    withCredentials: true,
  });
  return res.data.bookmarks;
};
export const searchuserAPI = async (input) => {
  try {
    console.log("In api call",input);
    const res = await axiosinstance.get(`/profile/searchuser/${input}`, {
      
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
    const res = await axiosinstance.delete(`/profile/deleteaccount`,{
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
    const res = await axiosinstance.get(`/profile/getallusers`,{
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