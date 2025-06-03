import React, { useContext, useState } from 'react';
import profilepic from '../../assets/noProfile.png';
import { HiPhotograph } from "react-icons/hi";
import { FaFileVideo } from "react-icons/fa";
import { uploadPost } from '../../utils/api/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNewsfeed } from '../../context/NewsfeedContext';

const UploadPost = () => {
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [preview, setPreview] = useState(null);
  const { pathname } = useLocation();
  const isPetitionMode = pathname.includes('petitions');
  const [petitionTitle, setPetitionTitle] = useState("");
  const { news, setNews } = useNewsfeed();
  const navigate = useNavigate();

  // Redirect to login if user is not logged in
  function userLoggedInHandler() {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }

  // Validation function
  const validateForm = () => {
    if (!desc.trim()) {
      toast.error(isPetitionMode ? "Petition description cannot be empty" : "Post description cannot be empty");
      return false;
    }
    
    if (isPetitionMode && !petitionTitle.trim()) {
      toast.error("Petition title cannot be empty");
      return false;
    }
    
    return true;
  };

  // Clear all form fields after successful upload
  const clearForm = () => {
    setFile(null);
    setPreview(null);
    setDesc("");
    setPetitionTitle("");
    setLoading(false);
  };

  const handlePostUpload = async () => {
    // Validate form before proceeding
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    userLoggedInHandler();
    try {
      const res = await uploadPost(user._id, desc, file);
      toast.success("Post uploaded successfully");
      clearForm();
      setNews((prevNews) => {
        return {
          ...prevNews,
          posts: [res.newPost, ...prevNews.posts]
        }
      })
      console.log(news, res)
    } catch (error) {
      toast.error("Post Failed.");
    } finally {
      setLoading(false);
    }
  }

  const handlePetitionPostUpload = async () => {
    // Validate form before proceeding
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await uploadPost(user._id, desc, file, petitionTitle, isPetitionMode);
      toast.success("Post uploaded successfully");
      clearForm();
      setNews((prevNews) => {
        return {
          ...prevNews,
          posts: [res.newPost, ...prevNews.posts]
        }
      })
    } catch (error) {
      toast.error("Post Failed.");
    } finally {
      setLoading(false);
    }
  }

  const handlePreview = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  // Check if form is valid for button styling
  const isFormValid = desc.trim() && (!isPetitionMode || petitionTitle.trim());

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Top Section - Profile Picture and Input */}
      <div className="flex items-start space-x-4">
        <img
          src={user?.profilePicture || profilepic}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-orange-200"
        />
        <div className='w-full'>
          {isPetitionMode && 
            <input
              type="text"
              placeholder={`Petition Title`}
              className="w-full p-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300 mb-2"
              value={petitionTitle}
              onChange={(e) => setPetitionTitle(e.target.value)}
            />
          }
          <input
            type="text"
            placeholder={`${isPetitionMode ? 'Petition Description' : "What's your opinion today?"}`}
            className="w-full p-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        {
          preview && (
            <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded-lg"/>
          )
        }
      </div>

      {/* Divider */}
      <hr className="my-4 border-orange-100" />

      {/* Bottom Section - Grouped Photo/Video Buttons and Upload Button */}
      <div className="flex justify-between items-center">
        {/* Grouped Photo and Video Buttons */}
        <div className="flex space-x-4">
          <label htmlFor='file' className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 cursor-pointer">
            <HiPhotograph className="w-6 h-6" />
            <span className="font-medium">Photo or Video</span>
            <input 
              type="file" 
              name="file" 
              id="file" 
              onChange={handlePreview}  
              className="hidden"  
              accept="image/png, image/jpeg"
              value=""
            />
          </label>
        </div>

        {/* Upload Button */}
        <button 
          disabled={loading || !isFormValid}
          onClick={isPetitionMode ? handlePetitionPostUpload : handlePostUpload} 
          className={`px-6 py-2 rounded-lg transition duration-200 ${
            loading || !isFormValid 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          {loading ? "Uploading" : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default UploadPost;