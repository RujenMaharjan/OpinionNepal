import React, { useContext, useEffect, useState, useRef } from 'react';
import { MdOutlineMoreVert, MdEdit, MdDelete } from "react-icons/md";
import profilepic from '../../assets/noProfile.png';
import likeicon from '../../assets/like.png';
import moment from "moment";
import { API, getUserData, likePost, siginPetition } from '../../utils/api/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { FaEye, FaThumbsDown, FaThumbsUp, FaUser } from 'react-icons/fa6';
import { useNewsfeed } from '../../context/NewsfeedContext';
import { Tab, Tabs } from '../Tabs';
import Comments from './Comments';
import { FaTimes, FaWindowClose } from 'react-icons/fa';
import SignatureInfo from './SignatureInfo';

const Post = ({ post }) => {
    const [like, setLike] = useState(post.likes?.length || 0); 
    const [isLiked, setIsLiked] = useState(false);
    const [user, setUser] = useState({});
    const { user: currentUser } = useContext(AuthContext);
    const [showOptions, setShowOptions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedDesc, setUpdatedDesc] = useState(post.desc || "");
    const optionsRef = useRef(null);
    const [isPetioned, setIsPetioned] = useState(post.petition?.signatures.includes(currentUser?._id)||false);
    const [petitionCount,setPetitionCount]=useState(post.petition?.signatures?.length || 0);
    const { news, setNews } = useNewsfeed();
    const {user:authenticatedUser}=useContext(AuthContext);
    const [showPetitionDialog, setShowPetitionDialog] = useState(false);

    const navigate = useNavigate();
    // Redirect to login if user is not logged in
  function userLoggedInHandler(){

      if (!authenticatedUser) {
        navigate("/login", { replace: true });
      }
    }
    // Add null check for currentUser
    useEffect(() => {
        if (currentUser) {
            setIsLiked(post.likes?.includes(currentUser?._id));
        }
    }, [currentUser, post.likes]);

    useEffect(() => {
        const getUserInfo = async () => {
            if (!post.userId) return;
            try { 
                const res = await getUserData(post.userId);
                setUser(res.data.userInfo || {}); 
            } catch (error) {
                console.error("Error fetching user info:", error);
                setUser({}); 
            }
        };
        if(post?.userId){
            getUserInfo();
        }
    }, [post.userId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLike = async () => {
        userLoggedInHandler();
        try {
            if (currentUser) { // Add null check for currentUser
                await likePost(post._id, currentUser._id);
                setLike(isLiked ? like - 1 : like + 1);
                setIsLiked(!isLiked);
            }
        } catch (error) {
            console.error("Error liking post:", error);
            toast.error(error.response?.data?.message || "Error liking post");
        }
    };


    const siginPetitionHandler = async () => {
        userLoggedInHandler();
        try {
            if (currentUser) { // Add null check for currentUser
                await siginPetition(post._id, currentUser._id);
                setPetitionCount(isPetioned ? petitionCount - 1 : petitionCount + 1);
                setIsPetioned(!isPetioned);
                setNews((prevNews)=>{
                    return {
                        ...prevNews,
                        posts: prevNews.posts.map((p) => {
                            if (p._id === post._id) {
                                return {
                                    ...p,
                                    petition: {
                                        ...p.petition,
                                        signatures: isPetioned
                                            ? p.petition.signatures.filter((signature) => signature !== currentUser._id)
                                            : [...p.petition.signatures, currentUser._id]
                                    }
                                };
                            }
                            return p;
                        })
                    };
                })
            }
        } catch (error) {
            console.error("Error suppourting petition:", error);
            toast.error(error.response?.data?.message || "Error suppourting petition");
        }
    };

    
    const handleUpdate = async () => {
        userLoggedInHandler();
        try {
            const response = await API.put(`/posts/update-post/${post._id}`, {
                userId: currentUser._id,
                desc: updatedDesc
            });
            toast.success(response.data.message);
            setIsEditing(false);
            // Update the post description in the UI
            post.desc = updatedDesc;
        } catch (error) {
            console.error("Error updating post:", error);
            toast.error(error.response?.data?.message || "You can only update your own posts");
        }
    };

    const handleDelete = async () => {
        userLoggedInHandler();
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                const response = await API.delete(`/posts/delete-post/${post._id}`, {
                    data: { userId: currentUser._id }
                });
                toast.success(response.data.message);
                // Remove the post from UI - this requires lifting state up or using context
                // In this we'll just reload the page
                setNews({ ...news, posts: news.posts.filter((p) => p._id !== post._id) });
            } catch (error) {
                console.error("Error deleting post:", error);
                toast.error(error.response?.data?.message || "You can only delete your own posts");
            }
        }
    };

    const toggleOptions = () => {
        userLoggedInHandler();
        setShowOptions(!showOptions);
    };

    const isCurrentUserPost = currentUser?._id === post.userId;

    function showHidePetitionDialogHandler(){
        userLoggedInHandler();
        setShowPetitionDialog(!showPetitionDialog);
    }

    const showPetitionSignatures = () => {
        userLoggedInHandler();
        showHidePetitionDialogHandler();
       
    };
    return (
        <div className='w-full rounded-lg shadow-lg mt-[30px] mb-[30px]'>
            <div className='p-[20px] bg-white rounded-md'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center w-full'>
                        <img
                            src={user.profilePicture || profilepic} 
                            alt="profilepic"
                            className='w-[32px] h-[32px] rounded-full object-cover'
                        />
                        <Link to={`/profile/${user.username}`}>
                        <span className='font-bold ml-[10px] mr-[10px]'>
                            {user.username || "Unknown User"}
                        </span>
                        </Link>
                        <span className='text-sm'>{moment(post.createdAt).fromNow()}</span>
                        {
                            post?.type === "petition" && (
                                <div className='flex items-center ml-auto'>
                                    <span className="bg-pink-100 text-pink-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-pink-900 dark:text-pink-300 ml-auto mr-3">Petition</span>
                                    {
                                        authenticatedUser._id === post.userId && (
                                            <span className='bg-pink-100 text-pink-800 text-xs font-medium me-2 px-2 py-2 rounded-full dark:bg-pink-900 dark:text-pink-300 hover:bg-orange-500 hover:text-white cursor-pointer' onClick={()=>showPetitionSignatures()}>
                                            <FaEye></FaEye>
                                        </span>
                                        )
                                    }
                                    {
                                        showPetitionDialog && (
                                            <>
                                             <div className="petitionDialog">
                                        <h3 className='petitionDialog__title'>
                                            Petitions
                                            <button onClick={()=>showHidePetitionDialogHandler()}><FaTimes></FaTimes></button>
                                        </h3>
                                        <ul className='petitionDialog__list'>
                                            {
                                                post.petition?.signatures.map((person) => (
                                                    <SignatureInfo signatureId={person} key={person}></SignatureInfo>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                    <div className="backdropCustom"></div>
                                            </>

                                        )
                                    }
                                   
                                </div>

                            )
                        }
                    </div>
                    <div className="relative" ref={optionsRef}>
                        <MdOutlineMoreVert 
                            className='text-xl cursor-pointer' 
                            onClick={toggleOptions}
                        />
                        {showOptions && isCurrentUserPost && (
                            <div className="absolute right-0 w-32 bg-white shadow-lg rounded-md z-10">
                                <div 
                                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setIsEditing(true);
                                        setShowOptions(false);
                                    }}
                                >
                                    <MdEdit className="mr-2" />
                                    <span>Edit</span>
                                </div>
                                <div 
                                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={handleDelete}
                                >
                                    <MdDelete className="mr-2" />
                                    <span>Delete</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='mt-[20px] mb-[20px]'>
                    {isEditing ? (
                        <div className="flex flex-col">
                            <textarea
                                value={updatedDesc}
                                onChange={(e) => setUpdatedDesc(e.target.value)}
                                className="p-2 border border-gray-300 rounded-md mb-2"
                                rows="3"
                            />
                            <div className="flex justify-end space-x-2">
                                <button 
                                    onClick={() => {
                                        setIsEditing(false);
                                        setUpdatedDesc(post.desc);
                                    }}
                                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleUpdate}
                                    className="px-3 py-1 bg-orange-500 text-white rounded-md"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                             {
                            post?.petition?.title && (
                                <div className='font-bolding text-lg'>{post?.petition?.title}</div>
                            )
                        }
                        <span>{post?.desc}</span>
                        </>
                    )}
                    {post?.img && post.img !=='null' && (
                        <img
                            src={post?.img}
                            alt="Post Picture"
                            className='mt-[20px] w-full object-contain'
                            style={{ maxHeight: "500px" }}
                        />
                    )}
                </div>
                <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                    <div className='flex items-center gap-[20px]'>
                        {
                            post?.type !== "petition" && (

                                <button type="button" className={`petition-suppourt ${isLiked && 'active'}`} onClick={()=>handleLike()}><FaThumbsUp></FaThumbsUp>{like} likes</button>
                               
                            )
                        }
                        {
                            post?.type === "petition" && (
                                <button type="button" className={`petition-suppourt ${isPetioned && 'active'}`} onClick={()=>siginPetitionHandler()}><FaUser></FaUser> {petitionCount} Support</button>
                            )
                        }
                    </div>
                    <div>
                        <span className='cursor-pointer border-b-[1px] border-slate-300 text-sm'>
                            
                        </span>
                    </div>

                </div>
                <div className='mt-5'>
                    <Comments post={post}></Comments>
                </div>

            </div>
        </div>
    );
};

export default Post;