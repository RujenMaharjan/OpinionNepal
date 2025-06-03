import { addComment, createPost, deleteComment, deletePost, getAllPosts, getPost, getTimelinePost, getTrendingPosts, likePost, siginPetition, updateComment, updatePost } from "../services/post.service.js";

export const createPostController = async (req, res) => {
    try {
        const filePath = req.file ? req.file.path : null; // Handle absence of file
        const newPost = await createPost(req.body, filePath);
        res.status(200).json({
            newPost,
            message: "Post has been created successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error Occurred Creating Post",
            error
        });
    }
};


export const updatePostController = async (req, res) => {
    try {
        const updatedPost = await updatePost(req.params,req.body);
        res.status(200).json({
            updatedPost,
            message: "Post has been updated successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error Occurred Updating Post",
            error}
            );
    }
}

export const deletePostController = async (req, res) => {
    try {
        const deletedPost = await deletePost(req.params,req.body);
        res.status(200).json({
            deletedPost,
            message: "Post has been deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error Occurred Deleting Post",
            error}
            );
    }
}

export const likePostController = async (req, res) => {
    try {
        const post = await likePost(req.params,req.body);
        res.status(200).json({
            post,
            message: "Post action completed successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Post action failed",
            error}
            );
    }
}

export const getPostController = async (req, res) => {
    try {
        const post = await getPost(req.params);
        res.status(200).json({
            post,
            message: "Post has been fetched successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Post fetch failed",
            error}
            );
    }
};

export const getTrendingPostsController = async (req, res) => {
    try {
        const posts = await getTrendingPosts();
        res.status(200).json({
            posts,
            message: "Trending Post has been fetched successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Trending posts fetch failed",
            error}
            );
    }
};

export const getTimelinePostController = async (req, res) => {
    try {
        const posts = await getTimelinePost(req.params);
        res.status(200).json({
            posts,
            message: "Timeline fetched successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Timeline fetch failed",
            error}
            );
    }
}

export const getAllPostController = async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.status(200).json({
            posts,
            message: "Posts have been fetched successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Posts fetch failed",
            error}
            );
    }
}

export const signInPetitionController = async (req, res) => {
    try {
        const result = await siginPetition(req.params, req.body);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        res.status(200).json({
            post: result.post,
            message: result.message,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error Occurred Signing Petition",
            error: error.message
        });
    }
};



export const addCommentController = async (req, res) => {
    try {
        const result = await addComment(req.params, req.body);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        res.status(200).json({
            post: result.post,
            message: result.message,
        });
    } catch (error) {
        console.error("Error in comment controller:", error);
        res.status(500).json({
            message: "Error occurred while adding comment",
            error: error.message
        });
    }
};


export const updateCommentController = async (req, res) => {
    try {
        const result = await updateComment(req.params, req.body);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        res.status(200).json({
            post: result.post,
            message: result.message,
        });
    } catch (error) {
        console.error("Error in update comment controller:", error);
        res.status(500).json({
            message: "Error occurred while updating comment",
            error: error.message
        });
    }
};


export const deleteCommentController = async (req, res) => {
    try {
        const result = await deleteComment(req.params, req.body);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        res.status(200).json({
            post: result.post,
            message: result.message,
        });
    } catch (error) {
        console.error("Error in delete comment controller:", error);
        res.status(500).json({
            message: "Error occurred while deleting comment",
            error: error.message
        });
    }
};
