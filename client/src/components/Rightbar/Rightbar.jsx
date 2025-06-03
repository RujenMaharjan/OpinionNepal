import { useEffect, useState } from 'react';
import { getTrendingPosts } from '../../utils/api/api';
import { useNewsfeed } from '../../context/NewsfeedContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Rightbar = () => {
  const [trendingPosts, setTrendingPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); 
  const { news, setNews } = useNewsfeed();
  useEffect(() => {
      const fetchPosts = async () => {
          try {
              const res =  await getTrendingPosts();
              setTrendingPosts(res.data.posts);
          } catch (error) {
              console.error("Error fetching posts:", error);
              setTrendingPosts([]);
          } finally {
              setLoading(false);
          }
      };
      fetchPosts();
  }, []);

  function onTrendingTopicClick(topic) {
    if (location.pathname.includes("profile") || location.pathname.includes("petitions")) {
      navigate("/"); 
    }
    setNews(topic);
  }
  
  if (loading) return <div>Loading...</div>;
  if (!trendingPosts || trendingPosts?.length === 0) return <div>No posts available.</div>;

  return (
    <div className="flex-3 p-5 bg-orange-50 border-l border-orange-200 rounded-lg shadow-md mt-5 mr-5 sticky top-[79px] h-[calc(100vh-105px)]">
      <h2 className="text-lg font-semibold text-orange-700 mb-4">Trending Topics</h2>
      <ul className="space-y-3 trendingList">
        {trendingPosts.map((topic) => (
          <li 
            key={topic.hashtag} 
            className={`flex justify-between items-center p-3 bg-orange-100 rounded-md hover:bg-orange-200 transition cursor-pointer relative
              ${topic.hashtag === news?.hashtag ? "bg-orange-200" : ""}
              `}
            onClick={()=>onTrendingTopicClick(topic)}
          >
            <span className="text-orange-700 font-medium">{topic.hashtag}</span>
            <span className="absolute -top-1 -right-1 bg-orange-600 text-orange-50 text-xs rounded-full px-1">{topic.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rightbar;
