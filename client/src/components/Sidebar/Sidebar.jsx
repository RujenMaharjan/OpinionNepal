import React, { useEffect, useState } from 'react';
import { IoIosPeople } from "react-icons/io";
import { FaFileSignature } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import test from '../../assets/test.jpeg';
import { Friends } from '../../data/dummyData';
import FriendsList from '../FriendsList/FriendsList';
import { toast } from 'react-toastify';
import { getUserFriends } from '../../utils/api/api';
import noProfile from '../../assets/noProfile.png';
import { Link, NavLink } from 'react-router-dom';

const Sidebar = ({ user = null }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await getUserFriends(user._id);
        setFriends(res.data.friends);
      } catch (error) {
        toast.error("Error fetching friends");
      }
    }
    if (user) {
      getFriends();
    }
  }, [user?._id, user]);

  return (
    <div className="flex-3 min-h-screen">
      <div className="p-5 sticky top-[78px] h-[calc(100vh-78px)] flex flex-col">
        {/* Fixed Header Content */}
        <div className="flex-shrink-0">
          {/* Sidebar Menu */}
          <ul className="space-y-4">
            <NavLink className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-100 transition duration-200 cursor-pointer" to={'/'}>
              <IoIosPeople className="text-orange-500 w-6 h-6" />
              <span className="text-orange-700 font-medium">Opinions</span>
            </NavLink>
            <NavLink className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-100 transition duration-200 cursor-pointer`} to={'/petitions'}>
              <FaFileSignature className="text-orange-500 w-6 h-6" />
              <span className="text-orange-700 font-medium">Petitions</span>
            </NavLink>

            {user &&
              <NavLink className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-100 transition duration-200 cursor-pointer`} to={`/profile/${user.username}`}>
                <ImProfile className="text-orange-500 w-6 h-6" />
                <span className="text-orange-700 font-medium">Profile</span>
              </NavLink>
            }
          </ul>

          {/* Post Button */}
          <button className="w-full mt-6 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200">
            Post
          </button>

          {/* Divider */}
          <hr className="my-6 border-orange-200" />

          {/* Followings Header */}
          <h2 className="text-lg font-semibold text-orange-700 mb-4">Followings</h2>
        </div>

        {/* Scrollable Friends List */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-4 pr-2"> 
            {friends.map((friend) => (
              <li className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-100 transition duration-200 cursor-pointer" key={friend._id}>
                <Link to={`/profile/${friend.username}`} className='flex items-center space-x-3'>
                  <img
                    src={friend?.profilePicture || noProfile}
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-orange-200"
                  />
                  <span className="text-orange-700 font-medium">{friend.username}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;