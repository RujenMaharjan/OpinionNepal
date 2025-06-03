import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";

export const createPost = async (body, file) => {
    try {
        const newPost = new postModel({
            ...body,
            ...(file && { img: file }), // Only add 'img' if file exists
        });
        await newPost.save();
        return newPost;
    } catch (error) {
        throw error;
    }
};


//Update Post

export const updatePost = async (params, body) => {
    try {
        // Find the post by ID
        const updatedPost = await postModel.findById(params.id);

        // Check if the post exists
        if (!updatedPost) {
            throw new Error("Post not found");
        }

        // Check if the user is the owner of the post
        if (updatedPost.userId === body.userId) {
            // Update the post, preserving the type of the post
            // If it's a petition type post, ensure the petition data stays intact
            if (updatedPost.type === "petition") {
                // If petition type, make sure to preserve the petition's structure
                body.petition = updatedPost.petition;  // Keep the petition field intact
            }

            // Perform the update operation
            await postModel.updateOne({ _id: params.id }, { $set: body });

            // Return the updated post
            const post = await postModel.findById(params.id);  // Fetch the updated post
            return post;
        } else {
            throw new Error("You can only update your post");
        }
    } catch (error) {
        throw error;
    }
};


//delete post
export const deletePost = async (params, body) => {
    try {
        // Find the post to delete
        const postToDelete = await postModel.findById(params.id);
        
        // Check if the post exists
        if (!postToDelete) {
            throw new Error("Post not found");
        }

        // Check if the user is the owner of the post
        if (postToDelete.userId === body.userId) {
            // Delete the post by ID
            await postModel.deleteOne({ _id: params.id });
            return postToDelete; // Return the deleted post or success message
        } else {
            throw new Error("You can only delete your post");
        }
    } catch (error) {
        throw error; // Pass the error to be handled later (if needed)
    }
};

//like post
export const likePost = async (params,body) => {
    try {
        const post = await postModel.findById(params.id);
        if(!post.likes.includes(body.userId)){
            await post.updateOne({$push:{likes:body.userId}});
            return post;
        }else{
            await post.updateOne({$pull:{likes:body.userId}});
        }   
        return post;
    } catch (error) {
        throw error;
    }
};

//like post
export const getPost = async (params) => {
    try {
        const post = await postModel.findById(params.id)
            .populate("userId", "username profilePicture") // Populate post owner details
            .populate("comments.supporter.userId", "username profilePicture")
            .populate("comments.opposer.userId", "username profilePicture")
            .populate("comments.alternative.userId", "username profilePicture");

        if (!post) throw new Error("Post not found");

        return post;
    } catch (error) {
        throw error;
    }
};


//ltrending posts
export const getTrendingPosts = async () => {
    try {
        const posts = await postModel.aggregate([
            {
                $match: {
                    desc: { $regex: /#\S+/ }, 
                    type: { $in: ["regular", "petition"] } 
                }
            },
            {
                $project: {
                    userId: 1,
                    desc: 1,
                    img: 1,
                    likes: 1,
                    comments: 1,
                    createdAt: 1,
                    type: 1,  
                    hashtags: {
                        $regexFindAll: {
                            input: "$desc",
                            regex: /#\S+/g 
                        }
                    }
                }
            },
            { $unwind: "$hashtags" },
            {
                $set: { hashtags: "$hashtags.match" } 
            },
            {
                $group: {
                    _id: "$hashtags",  
                    count: { $sum: 1 } 
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "posts",
                    let: { hashtag: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $regexMatch: { input: "$desc", regex: "$$hashtag", options: "i" } },
                                type: { $in: ["regular", "petition"] }  // Include both "regular" and "petition" posts
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                userId: 1,
                                desc: 1,
                                img: 1,
                                likes: 1,
                                comments: 1,
                                createdAt: 1,
                                type: 1  
                            }
                        }
                    ],
                    as: "posts"
                }
            },
            {
                $group: {
                    _id: "$_id", 
                    count: { $first: "$count" }, 
                    posts: { $push: "$posts" } 
                }
            },

            {
                $project: {
                    _id: 0,
                    hashtag: "$_id",
                    count: 1,
                    posts: { $arrayElemAt: ["$posts", 0] } 
                }
            },
            { $sort: { count: -1 } }
        ]);
        return posts;
    } catch (error) {
        throw error;
    }
};


export const getTimelinePost = async (params) => {
    try {
        const currentUser = await userModel.findOne({ username: params.username });

        if (!currentUser) {
            throw new Error("User not found");
        }

        const userPosts = await postModel.find({ userId: currentUser._id })
            .populate("userId", "username profilePicture") // Post owner details
            .populate("comments.supporter.userId", "username profilePicture")
            .populate("comments.opposer.userId", "username profilePicture")
            .populate("comments.alternative.userId", "username profilePicture");

        return userPosts;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getAllPosts = async () => {
    try {
        const posts = await postModel.find()
            .populate("userId", "username profilePicture") // Post owner details
            .populate("comments.supporter.userId", "username profilePicture")
            .populate("comments.opposer.userId", "username profilePicture")
            .populate("comments.alternative.userId", "username profilePicture");

        return posts;
    } catch (error) {
        throw error;
    }
};


// sign in petition 
export const siginPetition = async (params,body) => {
    try {
        const post = await postModel.findById(params.id);
        if (!post) throw new Error("Post not found");

        if (post.type !== "petition") throw new Error("Not a petition");

        if (!post.petition) {
            post.petition = { signatures: [] }; // Initialize petition object if missing
        }

        const index = post.petition.signatures.indexOf(body.userId);

        if (index === -1) {
            // If user hasn't signed, add signature
            post.petition.signatures.push(body.userId);
            await post.save();
            return { success: true, message: "Signed petition successfully", post };
        } else {
            // If user has signed, remove signature (undo)
            post.petition.signatures.splice(index, 1);
            await post.save();
            return { success: true, message: "Signature removed successfully", post };
        }
    } catch (err) {
        return { success: false, message: err.message };
    }
};


export const addComment = async (params, body) => {
    try {
        const { id } = params; // Post ID
        const { userId, text, category } = body; // Comment data

        // Map valid categories to database keys
        const categoryMap = {
            "Supporter's Voice": "supporter",
            "Opposer's Voice": "opposer",
            "Alternative Voice": "alternative"
        };

        const dbCategory = categoryMap[category];

        // Validate category
        if (!dbCategory) {
            return { success: false, message: "Invalid comment category" };
        }

        // Find the post
        const post = await postModel.findById(id);
        if (!post) {
            return { success: false, message: "Post not found" };
        }

        // Create new comment
        const newComment = { userId, text, createdAt: new Date() };

        // Push comment into the correct category
        post.comments[dbCategory].push(newComment);
        await post.save();

        // Fetch updated post with populated user info
        const updatedPost = await postModel.findById(id)
            .populate("userId", "username profilePicture") // Populate post owner
            .populate("comments.supporter.userId", "username profilePicture")
            .populate("comments.opposer.userId", "username profilePicture")
            .populate("comments.alternative.userId", "username profilePicture");

        return { success: true, message: "Comment added successfully", post: updatedPost };
    } catch (error) {
        console.error("Error adding comment:", error);
        return { success: false, message: "Error adding comment", error: error.message };
    }
};


export const deleteComment = async (params, body) => {
    try {
        const { postId, commentId, category } = params;
        const { userId } = body;


        const dbCategory = category;

        // Validate category
        if (!dbCategory) {
            return { success: false, message: "Invalid comment category" };
        }

        // Find the post
        const post = await postModel.findById(postId);
        if (!post) {
            return { success: false, message: "Post not found" };
        }

        // Find the comment
        const commentIndex = post.comments[dbCategory].findIndex(comment => comment._id.toString() === commentId);

        if (commentIndex === -1) {
            return { success: false, message: "Comment not found" };
        }

        // Check if the user is the owner of the comment
        if (post.comments[dbCategory][commentIndex].userId.toString() !== userId) {
            return { success: false, message: "You can only delete your own comment" };
        }

        // Remove the comment
        post.comments[dbCategory].splice(commentIndex, 1);
        await post.save();

        // Fetch updated post with populated user info
        const updatedPost = await postModel.findById(postId)
            .populate("userId", "username profilePicture")
            .populate("comments.supporter.userId", "username profilePicture")
            .populate("comments.opposer.userId", "username profilePicture")
            .populate("comments.alternative.userId", "username profilePicture");

        return { success: true, message: "Comment deleted successfully", post: updatedPost };
    } catch (error) {
        console.error("Error deleting comment:", error);
        return { success: false, message: "Error deleting comment", error: error.message };
    }
};


export const updateComment = async (params, body) => {
    try {
        const { postId, commentId, category } = params;
        const { userId, newText } = body;

        const dbCategory = category;

        // Validate category
        if (!dbCategory) {
            return { success: false, message: "Invalid comment category" };
        }

        // Find the post
        const post = await postModel.findById(postId);
        if (!post) {
            return { success: false, message: "Post not found" };
        }

        // Find the comment
        const commentIndex = post.comments[dbCategory].findIndex(comment => comment._id.toString() === commentId);

        if (commentIndex === -1) {
            return { success: false, message: "Comment not found" };
        }

        // Check if the user is the owner of the comment
        if (post.comments[dbCategory][commentIndex].userId.toString() !== userId) {
            return { success: false, message: "You can only update your own comment" };
        }

        // Update the comment text
        post.comments[dbCategory][commentIndex].text = newText;
        post.comments[dbCategory][commentIndex].createdAt = new Date(); // Update timestamp
        await post.save();

        // Fetch updated post with populated user info
        const updatedPost = await postModel.findById(postId)
            .populate("userId", "username profilePicture")
            .populate("comments.supporter.userId", "username profilePicture")
            .populate("comments.opposer.userId", "username profilePicture")
            .populate("comments.alternative.userId", "username profilePicture");

        return { success: true, message: "Comment updated successfully", post: updatedPost };
    } catch (error) {
        console.error("Error updating comment:", error);
        return { success: false, message: "Error updating comment", error: error.message };
    }
};
