import React, { useContext, useEffect, useState } from "react";
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Rightbar from '../components/Rightbar/Rightbar';
import NewsFeed from '../components/Newsfeed/NewsFeed';
import coverImage from '../assets/cover.jpeg';
import noProfilePic from '../assets/noProfile.png';
import { API, followUser, getUserProfileData, unfollowUser} from "../utils/api/api";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [isFollowed, setIsFollowed] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateData, setUpdateData] = useState({
    desc: "",
    city: "",
    from: "",
    relationship: ""
  });

  const [coverPicture, setCoverPicture] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [showEditFormFields, setShowEditFormFields] = useState(true);
  useEffect(() => {
    if (user._id && user.followers.length > 0 && user.followers.flat().includes(currentUser._id)) {
      setIsFollowed(true);
    }
  }, [user]);

  useEffect(() => {
    const getUserProfileInfo = async () => {
      try {
        const res = await getUserProfileData(username);
        setUser(res.data.userInfo || {});
        
        // Initialize update data with current user values
        if (res.data.userInfo) {
          setUpdateData({
            desc: res.data.userInfo.desc || "",
            city: res.data.userInfo.city || "",
            from: res.data.userInfo.from || "",
            relationship: res.data.userInfo.relationship || 0
          });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUser({});
      }
    };
    getUserProfileInfo();
  }, [username]);

  const handleFollow = async () => {
    try {
      if (isFollowed) {
        await unfollowUser(currentUser._id, user._id);
        dispatch({type: "UNFOLLOW", payload: user._id});
        setIsFollowed(false);
      } else {
        await followUser(currentUser._id, user._id);
        dispatch({type: "FOLLOW", payload: user._id});
        setIsFollowed(true);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setProfileImage(file);
      setEditMode(true);
      setShowEditFormFields(false);
    }
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
     setCoverPicture(URL.createObjectURL(file));
     setCoverImageFile(file);
     setEditMode(true);
     setShowEditFormFields(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let updatedUser = { ...currentUser }; // Clone the current user object
      if(updateData?.desc.length >150){
        setLoading(false)
        return;
      }
      // Handle profile picture update
      if (previewImage && profileImage && !showEditFormFields) {
        const formData = new FormData();
        formData.append("profilePicture", profileImage);
        try {
          const pictureRes = await API.put(`/users/${currentUser._id}/profile-picture`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
  
          // Update profile picture in user state and local storage
          updatedUser = { ...updatedUser, profilePicture: pictureRes.data.user.profilePicture };
          setUser((prev) => ({ ...prev, profilePicture: pictureRes.data.user.profilePicture }));
        } catch (error) {
          toast.error("Error updating profile picture");
          console.error("Error updating profile picture:", error);
        }
      }

      if (coverPicture && coverImageFile && !showEditFormFields) {
        const formData = new FormData();
        formData.append("coverPicture", coverImageFile);
        try {
          const pictureRes = await API.put(`/users/${currentUser._id}/cover-picture`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
  
          // Update profile picture in user state and local storage
          updatedUser = { ...updatedUser, coverPicture: pictureRes.data.user.coverPicture };
          setUser((prev) => ({ ...prev, coverPicture: pictureRes.data.user.coverPicture }));
        } catch (error) {
          toast.error("Error updating cover Picture ");
          console.error("Error updating cover picture:", error);
        }
      }
  
  
      // Handle other user data update
      const dataToUpdate = {
        userId: currentUser._id,
        ...updateData,
      };
  
      const userRes = await API.put(`/users/${currentUser._id}`, dataToUpdate);
      toast.success(userRes.data.message);
  
      // Merge updated data into updatedUser
      updatedUser = { ...updatedUser, ...updateData };
  
      // Update the Auth Context
      dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser });
  
      // Update Local Storage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setLoading(false);
      setPreviewImage(null);
      setEditMode(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error updating profile");
      console.error("Error updating profile:", error);
    }
  };
  const handleCancel = () => {
    setCoverPicture(null);
    setPreviewImage(null);
    setEditMode(false);
    // Reset update data to current user values
    setUpdateData({
      desc: user.desc || "",
      city: user.city || "",
      from: user.from || "",
      relationship: user.relationship || 0
    });
  };

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar user={currentUser}/>
        <div style={{ flex: 9 }} className="pr-5">
          {/* Cover and Profile Picture Section */}
          <div>
            <div className="h-[350px] relative">
              <img
                src={coverPicture || user.coverPicture || coverImage}
                alt="cover picture"
                className="w-full h-[250px] object-cover"
              />
              <img
                src={previewImage || user.profilePicture || noProfilePic}
                alt="profile picture"
                className="w-[150px] h-[150px] rounded-full object-cover absolute left-0 right-0 m-auto top-[150px] border-[3px] border-white"
              />
            </div>
            <div className="flex flex-col items-center mt-4">
              <h1 className="font-bold text-2xl text-orange-700">{user.username}</h1>
              {!editMode ? (
                      <span className="text-orange-600">{user.desc || "No Bio"}</span>
                    ) : (
                      showEditFormFields && (
                        <div className="flex flex-col">
                          <textarea
                            type="text"
                            name="desc"
                            value={updateData.desc}
                            onChange={handleInputChange}
                            placeholder="Add a bio"
                            className={`border rounded-md p-2 mt-2 w-64 outline-none ${
                              updateData.desc.length > 150 ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          <span
                            className={`text-sm mt-1 ${
                              updateData.desc.length > 150 ? "text-red-500" : "text-gray-500"
                            }`}
                          >
                            {updateData.desc.length}/150
                          </span>
                        </div>
                      )
                    )}
                                  
              {username === currentUser.username && (
                <>
                  {editMode ? (
                    <div className="flex flex-col w-64 mt-4">
                      {
                        showEditFormFields && (
                          <>
                            <div className="mb-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              City:
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={updateData.city}
                              onChange={handleInputChange}
                              placeholder="City"
                              className="border border-gray-300 rounded-md p-2 w-full"
                            />
                                                    </div>
                                                    <div className="mb-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              From:
                            </label>
                            <input
                              type="text"
                              name="from"
                              value={updateData.from}
                              onChange={handleInputChange}
                              placeholder="From"
                              className="border border-gray-300 rounded-md p-2 w-full"
                            />
                                                    </div>
                                                    <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Relationship:
                            </label>
                            <select
                              name="relationship"
                              value={updateData.relationship}
                              onChange={handleInputChange}
                              className="border border-gray-300 rounded-md p-2 w-full"
                            >
                              <option value={0}>Not specified</option>
                              <option value={1}>Single</option>
                              <option value={2}>In a relationship</option>
                              <option value={3}>Married</option>
                            </select>
                                                    </div>
                          </>
                        )
                      }
                  
                      <div className="flex justify-between">
                        <button
                          onClick={handleSave}
                          className="bg-orange-500 px-5 py-2 text-white rounded-md hover:bg-orange-600 transition"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-red-500 px-5 py-2 text-white rounded-md hover:bg-red-600 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => {
                          setShowEditFormFields(true);
                          setEditMode(true);
                        }}
                        className="bg-orange-500 px-5 py-2 text-white rounded-md hover:bg-orange-600 transition"
                      >
                        Edit Profile
                      </button>
                      <label
                        htmlFor="profilePicture"
                        className="text-white cursor-pointer bg-orange-500 px-5 py-2 rounded-md hover:bg-orange-600 transition"
                      >
                        Change Photo
                      </label>
                      <input
                        type="file"
                        id="profilePicture"
                        className="hidden"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="coverPicture"
                        className="text-white cursor-pointer bg-orange-500 px-5 py-2 rounded-md hover:bg-orange-600 transition"
                      >
                        Change Cover
                      </label>
                      <input
                        type="file"
                        id="coverPicture"
                        className="hidden"
                         accept="image/png, image/jpeg"
                        onChange={handleCoverFileChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Follow/Unfollow Button */}
          {user.username !== currentUser.username && (
            <div className="flex justify-center mt-4">
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                onClick={handleFollow}
              >
                {isFollowed ? "Unfollow" : "Follow"}
              </button>
            </div>
          )}

          {/* User Details (only show when not in edit mode) */}
          {!editMode && (
            <div className="flex flex-col items-center mt-4">
              {user.city && (
                <p className="text-gray-700">
                  <span className="font-semibold">City:</span> {user.city}
                </p>
              )}
              {user.from && (
                <p className="text-gray-700">
                  <span className="font-semibold">From:</span> {user.from}
                </p>
              )}
              {user.relationship !== undefined && user.relationship !== 0 && (
                <p className="text-gray-700">
                  <span className="font-semibold">Relationship:</span>{" "}
                  {user.relationship === 1
                    ? "Single"
                    : user.relationship === 2
                    ? "In a relationship"
                    : "Married"}
                </p>
              )}
            </div>
          )}

          {/* Main Content Section */}
          <div className="flex mt-6">
            <NewsFeed username={user.username} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;