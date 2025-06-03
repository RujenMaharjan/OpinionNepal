import React, { useContext, useState } from 'react';
import Logo from '../Logo/Logo';
import { IoSearch } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import profilePic from '../../assets/profilepic.png';
import { Link, NavLink, redirect } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { logoutUser } from '../../utils/api/auth.api';
import noProfile from '../../assets/noProfile.png';
import { useNavigate } from 'react-router-dom';
import { useNewsfeed } from '../../context/NewsfeedContext';
import { searchUsers } from '../../utils/api/api';

const Navbar = ({setRefeshKey}) => {
  const { user, dispatch } = useContext(AuthContext);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const { news, setNews } = useNewsfeed();
  const navigate = useNavigate();
  const [isSearchUsersError,searchUsersError]=useState("");

  // Redirect to login if user is not logged in
  function userLoggedInHandler(){

    if (!user) {
      navigate("/login", { replace: true });
    }
  }

  // Toggle dropdown visibility
  const toggleDropdown = () => {
  userLoggedInHandler();
    setIsDropdownVisible(!isDropdownVisible);
  };

  // Handle logout
  const handleLogout = () => {
    logoutUser(dispatch);
    navigate("/login", { replace: true });
  };

  function clearNewsFeed(){
    setNews(null);
  }

  function redirectToNewsFeed(){
    setRefeshKey(prevKey=>prevKey+1)
  }

  const handleSearch = async (value) => {
    setSearchText(value);
    userLoggedInHandler();
    if (value) {
      try {
        const response = await searchUsers(value);  // Calling the API
        if(response?.data?.users?.length>0){
          searchUsersError(false);
          setFetchedUsers(response.data.users);  // Assuming the response data contains the user data
        }
        else{
          searchUsersError(response.data.message);
          setFetchedUsers([]); 
        }
      } catch (error) {
        console.error("Error searching users:", error);
      }
    } else {
      searchUsersError(false);
      setFetchedUsers([]);  // Reset results if no search text
    }
  }
  return (
    <div className='h-[50px] w-full bg-orange-500 flex items-center sticky top-0 z-50 shadow-[0_3px_6px_#24272c1a] mb-2'>
      {/* Left Section - Logo */}
      <div className="left" style={{ flex: 3 }} >
        <NavLink to={"/"}   onClick={redirectToNewsFeed}>
          <div className="logodiv pl-4">
            <Logo />
          </div>
        </NavLink>
      </div>

      {/* Center Section - Search Bar */}
      <div className="center flex items-center justify-center" style={{ flex: 6 }}>
        <div className="relative w-full max-w-md">
          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-200" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-orange-100 text-orange-900 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
          />
           {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 hover:text-orange-700"
              >
                ❌
              </button>
            )}
          {
            fetchedUsers?.length>0 && (
              <ul className="absolute top-10 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                {
                  fetchedUsers.map((user) => (
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2.5" key={user._id} onClick={()=>navigate(`/profile/${user.username}`)}>
                      <img src={user.profilePicture} alt="" className='h-[32px] rounded-full object-cover'/>
                      {user.username}
                    </li>
                  ))
                }
              </ul>
            )
          }
          {
            (isSearchUsersError && searchText.length>0) && (
              <div className="absolute top-10 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-5 px-4 text-red-500 text-center">
                {isSearchUsersError}
              </div>
            )
          }
     
        </div>
      </div>

      {/* Right Section - Links and Icons */}
      <div className="right flex items-center justify-end pr-4" style={{ flex: 4 }}>

        {/* Tab Icons */}
        <div className="tabIcons flex items-center space-x-4">
          
         
          <div className="profilePicDiv relative">
            <div className="userBox" onClick={toggleDropdown}>
              <img
                src={user?.profilePicture || noProfile}
                alt="Profile picture"
                className='w-8 h-8 rounded-full border-2 border-orange-200 hover:border-orange-50 transition duration-200 cursor-pointer'
              />
              <span>{user?.username}</span>
            </div>
            {/* Dropdown Menu */}
            {isDropdownVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <Link
                    to={`/profile/${user ? user.username : ''}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;