import express from "express";
import { deleteUserController, followUserController, getUserController, getUserFriendsController, getUserProfileController, getUsersSearchController, unfollowUserController, updateCoverPictureController, updateProfilePictureController, updateUserController } from "../controllers/user.controller.js";
import { parser } from "../config/cloudinary.js";

const router= express.Router();
router.get("/searchUsers", getUsersSearchController);

//update USER
router.put("/:id",updateUserController);
//delete USER
router.delete("/:id",deleteUserController);
//get a USER
router.get("/:id",getUserController);
//get a USERProfile
router.get("/",getUserProfileController);



//follow a user
router.put("/follow/:id",followUserController);

//unfollow user
router.put("/unfollow/:id",unfollowUserController);

//getFriends
router.get("/friends/:userId",getUserFriendsController);

//update profile picture
router.put("/:id/profile-picture",parser.single("profilePicture"), updateProfilePictureController);

router.put("/:id/cover-picture",parser.single("coverPicture"), updateCoverPictureController);

export default router;