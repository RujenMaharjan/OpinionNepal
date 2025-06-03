import { deleteUser, followUser, getUser, getUserFriends, getUserProfile, getUsersSearch, unfollowUser, updateCoverPicture, updateProfilePicture, updateUser } from "../services/user.service.js";

export const updateUserController =async (req, res)=>{
    if(req.body.userId=== req.params.id){
        try {
            const user= await updateUser(req.params.id, req.body);
            res.status(200).json(
                {
                    user, 
                    message:"Account has been updated succesfully",
                }
            );
        } catch (error) {
        console.log(error);
        res.status(500).json(error);
        }   
    }
    else{
        res.status(500).json("you can only update your account");
    }
};

export const deleteUserController =async (req, res)=>{
    if(req.body.userId=== req.params.id){
        try {
            await deleteUser(req.params.id);
            res.status(200).json(
                {
                    message:"Account has been deleted succesfully",
                }
            );
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    } 
    else{
        res.status(500).json("you can only delete your account")
    }   
};

export const getUserController =async (req, res)=>{
    try {
        const user=await getUser(req.params.id);
        const {password,...data}=user._doc;
        res.status(200).json(
            {
                userInfo: data,
                message:"Account has been fetched succesfully",
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const followUserController = async (req, res) => {
    try {
        const user=await followUser(req.body,req.params);
        res.status(200).json(
            {
                user,
                message:"Account has been fetched succesfully",
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const unfollowUserController =async (req, res)=>{
    try {
        const user=await unfollowUser(req.body,req.params);
        res.status(200).json(
            {
                user,
                message:"Account has been fetched succesfully",
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const getUserProfileController = async (req, res) => {
    try {
        const user = await getUserProfile(req.query);
        
        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure password is removed
        const { password, ...data } = user._doc;

        res.status(200).json({
            userInfo: data,
            message: "Account has been fetched successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching user profile", error });
    }
};

export const getUsersSearchController = async (req, res) => {
    try {
        console.log(req.query);
        const users = await getUsersSearch(req.query);

        if (!users || users.length === 0) {
            return res.status(200).json({ message: "No users found" });
        }

        const usersData = users.map(user => {
            const { password, ...data } = user._doc;
            return data;
        });

        res.status(200).json({
            users: usersData,
            message: "Users have been fetched successfully",
        });
    } catch (error) {
        console.error(error); // Log actual error for debugging
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};
export const updateProfilePictureController = async (req, res) => {
    try {
        const user = await updateProfilePicture(req.params.id, req.file.path);
        res.status(200).json(
            {
                user,
                message: "Profile picture has been updated successfully",
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const getUserFriendsController = async (req, res) => {
    try {
        const friends = await getUserFriends(req.params);
        res.status(200).json(
            {
                friends,
                message:"Friends has been fetched succesfully",
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


export const updateCoverPictureController = async (req, res) => {

    try {
        const user = await updateCoverPicture(req.params.id, req.file.path);
        res.status(200).json(
            {
                user,
                message: "Cover picture has been updated successfully",
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

