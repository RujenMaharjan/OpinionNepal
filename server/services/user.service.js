import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";

export const updateUser = async(userId, updateData) => {
    if(updateData.password){
        try {
            updateData.password= await bcrypt.hashSync(updateData.password,10)
        } catch (error) {
            throw error;
        }
    }
    try {
        const user= await UserModel.findByIdAndUpdate(userId,{
            $set: updateData,
        },{
            new: true,
        });
        return user;
    } catch (error) {
        throw error;
    }
};

export const updateProfilePicture = async(userId, newProfilePicture) => {
    try {
        const user= await UserModel
        .findByIdAndUpdate(userId,{
            $set:{profilePicture: newProfilePicture},
        },{
            new: true,
        });
        return user;
    }
    catch(error){
        throw error;
    }
};

export const deleteUser = async(userId) => {
    try {
        await UserModel.findByIdAndDelete(userId);
    } catch (error) {
        throw error;
    }
}

export const getUser = async(userId, updateData) => {
    try {
        const user= await UserModel.findById(userId);
        return user;
    } catch (error) {
        throw error;
    }
}

export const followUser = async (userdata, updateData) => {
    // Check if trying to follow self
    if (userdata.userId === updateData.id) {
        throw new Error("You can't follow yourself");
    }
    else{
    try {
        const user= await UserModel.findById(userdata.userId);
        const currentUser= await UserModel.findById(updateData.id);
        if(!user.followings.includes(updateData.id)){
            await user.updateOne({$push:{followings:updateData.id}});
            await currentUser.updateOne({$push:{followers:userdata.userId}});
            return {user,currentUser};
        }else{
            throw new Error("You already follow this user");
        }
    } catch (error) {
        throw error;
    }
    }
};

export const unfollowUser = async(userdata,updateData)=>
{
    if(userdata.userId===updateData.id){
        throw new Error("You can't unfollow yourself");
    }else{
        try{
        const user= await UserModel.findById(userdata.userId);
        const currentUser= await UserModel.findById(updateData.id);
        if(user.followings.includes(updateData.id)){
            await user.updateOne({$pull:{followings:updateData.id}},{new:true});
            await currentUser.updateOne({$pull:{followers:userdata.userId}},{new:true});
            return {user,currentUser};
        }else{
            throw new Error("You have don't follow this user");
        }
    }
    catch(error){
        throw error;
    }
    }
    
};

export const getUserProfile = async(query) => {
    try {
        const user= await UserModel.findOne({username: query.username});
        return user;
    } catch (error) {
        throw error;
    }
}
export const getUsersSearch = async (query) => {
    try {
        if (!query.username) {
            throw new Error("Username query parameter is required");
        }
        const users = await UserModel.find({ username: { $regex: query.username, $options: "i" } });
        return users;
    } catch (error) {
        throw error;
    }
};


export const getUserFriends = async(params) => {
    try {
        const user= await UserModel.findById(params.userId);
        const friends= await Promise.all(
            user.followings.map((friendId)=>{
                return UserModel.findById(friendId);
            })
        );
        const friendList=[];
        friends.map((friend)=>{
            const {_id,username,profilePicture}=friend;
            friendList.push({_id,username,profilePicture});
        });
        return friendList;
    } catch (error) {
        throw error;
    }
}


export const updateCoverPicture = async (userId, newCoverPicture) => {
    try {
        const user = await UserModel.findByIdAndUpdate(
            userId, 
            { $set: { coverPicture: newCoverPicture } }, // Update the coverPicture field
            { new: true } // Return the updated user document
        );
        
        return user; // Return the updated user
    } catch (error) {
        throw error; // Throw the error if something goes wrong
    }
};