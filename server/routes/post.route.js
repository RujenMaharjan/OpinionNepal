import express from "express";
import { addCommentController, createPostController, deleteCommentController, deletePostController, getAllPostController, getPostController, getTimelinePostController, getTrendingPostsController, likePostController, signInPetitionController, updateCommentController, updatePostController } from "../controllers/post.controller.js";
import { parser } from "../config/cloudinary.js";

const router= express.Router();

//create post route
router.post("/create-post", parser.single("img"), createPostController);

//updte post route
router.put("/update-post/:id", updatePostController);

//delete post route
router.delete("/delete-post/:id", deletePostController);

//like post route
router.put("/like-post/:id", likePostController);

//get post route
router.get("/get-post/:id", getPostController);

//get timeline route
router.get("/get-timeline-post/:username", getTimelinePostController);

//get all post route
router.get("/", getAllPostController);

//get all trending post route
router.get("/trending-posts", getTrendingPostsController);

router.post("/:id/sign", signInPetitionController);

router.post("/:id/comment", addCommentController);
router.put("/:postId/comments/:commentId/:category", updateCommentController); // Update Comment
router.delete("/:postId/comments/:commentId/:category", deleteCommentController); // Delete Comment

export default router;