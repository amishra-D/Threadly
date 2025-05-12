import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const addcommentAPI = async ({ postId, parentCommentId, content }) => {
    console.log(parentCommentId);

    const res = await axios.post(
        `${BASE_URL}/comments/addcomment/${postId}`, 
        { content },                         
        {
            params: { parentCommentId },   
            withCredentials: true        
        }
    );
    return res.data;
};

export const getcommentAPI=async(postId)=>{
    const res=await axios.get(`${BASE_URL}/comments/getcomments/${postId}`,{
        withCredentials: true
    });
    console.log(res.data)
    return res.data;
}
export const deletecommentAPI=async(commentId)=>{
    console.log(commentId)
    const res=await axios.delete(`${BASE_URL}/comments/deletecomment/${commentId}`,{
        withCredentials: true
    });
    return res.data;
}
export const addlikecommentAPI=async(commentId)=>{
    const res=await axios.post(`${BASE_URL}/comments/likecomment/${commentId}`,null,{
        withCredentials: true
    });
    console.log("mycommentid",commentId)
    return res.data;
}
export const addislikecommentAPI=async(commentId)=>{
        console.log("in api",commentId)
    const res=await axios.post(`${BASE_URL}/comments/dislikecomment/${commentId}`,null,{
        withCredentials: true
    });
    return res.data;
}