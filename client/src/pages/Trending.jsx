import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import Rightbar from '../components/Rightbar/Rightbar'
import NewsFeed from '../components/Newsfeed/NewsFeed'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar/Navbar'

const Trending = () => {
  const {username}= useParams();
  const[user,setUser]=useState({});
  const {user:currentUser}=useContext(AuthContext);
  return (
    <>
    <Navbar></Navbar>
        <div className="flex">
            <Sidebar user={currentUser}/>
            <NewsFeed/>
            <Rightbar/>
        </div>

    </>
  )
}

export default Trending