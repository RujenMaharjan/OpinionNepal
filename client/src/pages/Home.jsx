import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import Rightbar from '../components/Rightbar/Rightbar'
import NewsFeed from '../components/Newsfeed/NewsFeed'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar/Navbar'

const Home = () => {
  const {username}= useParams();
  const[user,setUser]=useState({});
  const {user:currentUser}=useContext(AuthContext);
  const [refreshKey,setRefeshKey]=useState(0);
  return (
    <>
    <Navbar refreshKey={refreshKey} setRefeshKey={setRefeshKey}></Navbar>
        <div className="flex">
            <Sidebar user={currentUser}/>
            <NewsFeed refreshKey={refreshKey} setRefeshKey={setRefeshKey}/>
            <Rightbar/>
        </div>

    </>
  )
}

export default Home