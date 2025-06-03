import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext';
import moment from 'moment';
import { MdDelete, MdEdit, MdOutlineMoreVert } from 'react-icons/md';
import { FaArrowRight } from 'react-icons/fa6';
import { deleteComment, getUserData, updateComment } from '../../utils/api/api';
import { toast } from 'react-toastify';
import { useNewsfeed } from '../../context/NewsfeedContext';
import noProfile from '../../assets/noProfile.png';
import { useNavigate } from 'react-router-dom';

function Comment({ comment,postId, category}) {
    const { user } = useContext(AuthContext);
    const [isCommentMenuOpen, setIsCommentMenuOpen] = useState(false);
    const [commentText,setCommentText] = useState(comment.text);
    const [isEditMode, setIsEditMode] = useState(false);
    const { news, setNews } = useNewsfeed();
    const [profilePic, setProfilePic] = useState(null);
    const navigate=useNavigate();


    useEffect(() => {
        async function fetchProfilePicture() {
            if (!comment.userId.profilePicture) {
                const img = await findUserImage(comment.userId);
                setProfilePic(img);
            }
        }
        fetchProfilePicture();
    }, [comment.userId]);

    function userLoggedInHandler(){
        if (!user) {
          navigate("/login", { replace: true });
        }
    }
    const updateCommentHandler = async () => {
        userLoggedInHandler();
        const updatedPayload = {
            userId: user._id, // The ID of the user updating the comment
            newText: commentText, // The new text for the comment
          };
          try {
              const response = await updateComment(postId,comment._id,category,updatedPayload);
              toast.success(response.data.message);
              setNews((prevNews) => {
                  const updatedPosts = prevNews.posts.map((p) => {
                      if (p._id === postId) {
                          return response.data.post;
                      }
                      return p;
                  });
                  return { ...prevNews, posts: updatedPosts };
              });
              setIsEditMode(false);
              setCommentText(comment.text);
          } catch (error) {
              console.error("Error updating post:", error);
          }
    };

    const deleteCommentHandler = async () => {
        userLoggedInHandler();
          try {
              const response = await deleteComment(postId,comment._id,category,user._id);
              toast.success(response.data.message);
                setNews((prevNews) => {
                  const updatedPosts = prevNews.posts.map((p) => {
                      if (p._id === postId) {
                          return response.data.post;
                      }
                      return p;
                  });
                  return { ...prevNews, posts: updatedPosts };
              });
              setIsEditMode(false);
          } catch (error) {
              console.error("Error updating post:", error);
          }
    };

    async function  findUserImage(userId) {
        try {
            const response = await getUserData(userId);
            return response.data.userInfo.profilePicture;
        } catch (error) {
            console.error("Error updating post:", error);
        }
    }
    return (
        <div className={`comment ${category === 'supporter' ? 'comment--supporter' : category === 'opposer' ? 'comment--opposer' : 'comment--alternative'}`}>
            <div className="userProfile">
                <img src={comment.userId.profilePicture || profilePic || noProfile}
                    alt="" className='userProfile__img' />
                <div className="userProfile__info">
                    <h3>{comment.userId.username}</h3>
                    <span>{moment(comment.createdAt).fromNow()}</span>
                </div>
                {
                    user?._id === comment.userId._id && (
                        <div 
                        className="relative" 
                        tabIndex={0} // Ensure the div is focusable so onBlur works correctly
                        onBlur={(e) => {
                            // Check if blur is happening due to clicking inside the menu
                            if (!e.currentTarget.contains(e.relatedTarget)) {
                                setIsCommentMenuOpen(false);
                            }
                        }}
                    >
                        <button onClick={() => setIsCommentMenuOpen(!isCommentMenuOpen)}>
                            <MdOutlineMoreVert className='text-xl cursor-pointer' />
                        </button>
                    
                        {isCommentMenuOpen && (
                            <div className="absolute right-0 w-32 bg-white shadow-lg rounded-md z-10">
                                <div
                                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                    onMouseDown={(e) => {
                                        e.preventDefault(); // Prevents blur event from firing
                                        setIsEditMode(!isEditMode);
                                        setIsCommentMenuOpen(false);
                                    }}
                                >
                                    <MdEdit className="mr-2" />
                                    <span>Edit</span>
                                </div>
                                <div
                                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        deleteCommentHandler();
                                        
                                    }}
                                >
                                    <MdDelete className="mr-2" />
                                    <span>Delete</span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    )
                }
            </div>
            <div className="comment__text">
                {
                    isEditMode ? <div className="userProfile__info commentForm__formField">
                        <input type="text" className='commentForm__textBox'
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder='Add a comment...'
                            />
                        <button className='commentForm__submitBtn' onClick={() => updateCommentHandler()}>
                            <FaArrowRight />
                        </button>
                        <button className='commentForm__submitBtn commentForm__submitBtn--cancel' onClick={() => setIsEditMode(false)}>
                            cancel
                        </button>
                    </div> : (comment.text)
                }
            </div>
        </div>
    )
}

export default Comment