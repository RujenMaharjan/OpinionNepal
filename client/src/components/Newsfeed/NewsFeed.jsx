import React, { useEffect, useState } from 'react';
import UploadPost from '../UploadPost/UploadPost';
import Post from '../Post/Post';
import axios from 'axios';
import { getAllPosts, getTimelinePost } from '../../utils/api/api.js';
import { useNewsfeed } from '../../context/NewsfeedContext.jsx';

const   NewsFeed = ({ username ,refreshKey,setRefeshKey}) => {
    const [loading, setLoading] = useState(true);
    const { news, setNews } = useNewsfeed();
    const pathname= window.location.pathname;
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let profileUser=structuredClone(username);
                if(pathname.includes("profile")){
                    profileUser=pathname?.split("/")[2];
                }
                const res = profileUser ? await getTimelinePost(profileUser) : await getAllPosts();
                setNews({
                    ...res.data,
                    posts: res.data.posts.filter((post) => {
                        console.log(pathname)
                        if(pathname.includes("petitions")){
                            return post.type==="petition"   
                        }
                        else if(pathname.includes('profile')){
                            return post;
                        }

                        return post.type==="regular"
                    })
                });
            } catch (error) {
                console.error("Error fetching posts:", error);
                setNews([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [username,refreshKey,pathname]);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ flex: 6.5 }} className="p-5 pl-0">
            {!username && <UploadPost />}
            {(!news || news?.posts?.length === 0) && <div>No posts available.</div>}
            {news?.posts?.map((post) => (
                <Post key={post._id} post={post} />
            ))}
        </div>
    );
};

export default NewsFeed;
