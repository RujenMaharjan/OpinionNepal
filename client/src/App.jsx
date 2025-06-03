import { useContext, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Import BrowserRouter
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { AuthContext } from "./context/AuthContext";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Trending from "./pages/Trending";

function App() {
  const {user}= useContext(AuthContext);
  return (
    <>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/petitions" element={user? <Trending />: <Login/>} />
        <Route path="/register" element={user? <Navigate to={"/"} />:<Register />} />
        <Route path="/login" element={user? <Navigate to={"/"} />: <Login />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;