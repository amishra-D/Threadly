import { axiosinstance } from "@/utils/axios";

export const addcommentAPI = async ({ postId, parentCommentId, content }) => {
    const res = await axiosinstance.post(
        `/comments/addcomment/${postId}`, 
        { content },                         
        {
            params: { parentCommentId },   
            withCredentials: true        
        }
    );
    return res.data;
};

export const getcommentAPI=async(postId)=>{
    const res=await axiosinstance.get(`/comments/getcomments/${postId}`,{
        withCredentials: true
    });
    return res.data;
}
export const deletecommentAPI=async(commentId)=>{
    console.log(commentId)
    const res=await axiosinstance.delete(`/comments/deletecomment/${commentId}`,{
        withCredentials: true
    });
    return res.data;
}
export const addlikecommentAPI=async(commentId)=>{
    const res=await axiosinstance.post(`/comments/addlike/${commentId}`,null,{
        withCredentials: true
    });
    console.log("mycommentid",commentId)
    return res.data;
}
export const addislikecommentAPI=async(commentId)=>{
        console.log("in api",commentId)
    const res=await axiosinstance.post(`/comments/adddislike/${commentId}`,null,{
        withCredentials: true
    });
    return res.data;
}