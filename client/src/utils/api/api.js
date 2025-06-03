import axios from "axios";

export const API = axios.create({ baseURL: "http://localhost:5001/api/v1" });

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const getTimelinePost = (username) =>{
    return API.get(`/posts/get-timeline-post/${username}`);
};

export const getUserData = (userId) =>{
    return API.get(`/users/${userId}`);
};

export const getAllPosts = () =>{
    return API.get('/posts');
};


export const getTrendingPosts = () =>{
  return API.get('/posts/trending-posts');
}
export const getUserProfileData= (username) =>{
    return API.get(`/users?username=${username}`);
};

export const likePost = (postId,userId) =>{
    return API.put(`/posts/like-post/${postId}`,{userId:userId});
};

export const siginPetition = (postId,userId) =>{
  return API.post(`/posts/${postId}/sign`,{userId:userId});
};

export const uploadPost = async (userId,desc,img,petitionTitle='',isPetitionMode=false) =>{
    const formData = new FormData();
    formData.append("img",img);
    formData.append("userId",userId);
    formData.append("desc",desc);
    if(isPetitionMode){
        formData.append("type","petition");
        formData.append("petition[title]",petitionTitle);
    }
    else{
        formData.append("type","regular");
    }
    const res= await API.post("/posts/create-post",formData,{
        headers:{
            "Content-Type":"multipart/form-data",
        },
    });
    return res.data;
};

export const unfollowUser = (userId,id) =>{
    return API.put(`/users/unfollow/${id}`,{userId:userId});
}

export const followUser = (userId,id) =>{
    return API.put(`/users/follow/${id}`,{userId:userId});
}

export const getUserFriends = (userId) =>{
    return API.get(`/users/friends/${userId}`);
}

export const updateUserData = async (userId, updateData) => {
  return await API.put(`/users/${userId}`, updateData);
};

export const updatePost = async (postId, userId, updatedData) => {
  return await API.put(`/posts/update-post/${postId}`, {
    userId,
    ...updatedData
  });
};

export const deletePost = async (postId, userId) => {
  return await API.delete(`/posts/delete-post/${postId}`, {
    data: { userId }
  });
};

export const searchUsers= (username) =>{
  username=username.toString();
  return API.get(`/users/searchUsers?username=${username}`);
};

export const addComment =  (postId, commentPayload) => {
    return API.post(`/posts/${postId}/comment`,commentPayload);
  
};

export const updateComment = (postId, commentId, category, updatedPayload) => {
  return API.put(`/posts/${postId}/comments/${commentId}/${category}`, updatedPayload);
};

// Delete a comment
export const deleteComment = (postId, commentId, category, userId) => {
  return API.delete(`/posts/${postId}/comments/${commentId}/${category}`, {
    data: { userId },  // Send userId in the request body
  });
};
// {
//   userId,
//   text,
//   category, // 'supporter', 'opposer', or 'alternative'
// }
