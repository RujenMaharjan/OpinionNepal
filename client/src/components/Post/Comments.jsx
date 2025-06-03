import React, { useContext, useState } from 'react'
import { Tab, Tabs } from '../Tabs'
import { FaArrowRight } from 'react-icons/fa6';
import profilepic from '../../assets/noProfile.png';
import { addComment } from '../../utils/api/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useNewsfeed } from '../../context/NewsfeedContext';
import { FaEllipsisV } from 'react-icons/fa';
import { MdDelete, MdEdit, MdOutlineMoreVert } from 'react-icons/md';
import Comment from './Comment';
import { useNavigate } from 'react-router-dom';

function Comments({ post }) {
    const [comment, setComment] = useState('');
    const [activeTab, setActiveTab] = useState("Supporter's Voice"); // Default active tab
    const { user } = useContext(AuthContext);
    const { news, setNews } = useNewsfeed();
    const navigate=useNavigate();
    function userLoggedInHandler(){
        if (!user) {
          navigate("/login", { replace: true });
        }
        return;
    }
    const submitCommentHandler = async () => {
        userLoggedInHandler();
        try {
            const response = await addComment(post._id, {
                userId: user._id,
                text: comment,
                category: activeTab, // Send active tab in API request
            });
            toast.success(response.data.message);
            setNews((prevNews) => {
                const updatedPosts = prevNews.posts.map((p) => {
                    if (p._id === post._id) {
                        return response.data.post;
                    }
                    return p;
                });
                return { ...prevNews, posts: updatedPosts };
            });
            setComment("");
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    return (
        <>
            <Tabs onTabChange={setActiveTab}>
                <Tab label="Supporter's Voice">
                    <div className="comment__list">
                        {post.comments.supporter.map((comment) => (
                                <Comment key={comment._id} comment={comment} postId={post._id} category={'supporter'}/>
                        ))}
                    </div>
                </Tab>
                <Tab label="Opposer's Voice">
                    <div className="comment__list">
                        {post.comments.opposer.map((comment) => (
                            <Comment key={comment._id} comment={comment} postId={post._id}  category={'opposer'}/>
                        ))}
                    </div>
                </Tab>
                <Tab label="Alternative Voice">
                    <div className="comment__list">
                        {post.comments.alternative.map((comment) => (
                            <Comment key={comment._id} comment={comment} postId={post._id} category={'alternative'}/>
                        ))}
                    </div>
                </Tab>
            </Tabs>
            <div className='commentForm'>
                <div className="userProfile">
                    <img src={user?.profilePicture|| profilepic}
                        alt="" className='userProfile__img' />
                    <div className="userProfile__info commentForm__formField">
                        <input type="text" className='commentForm__textBox'
                            value={comment}
                            placeholder='Add a comment...'
                            onChange={(e) => setComment(e.target.value)} />
                        <button onClick={submitCommentHandler} className='commentForm__submitBtn'>
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Comments;
