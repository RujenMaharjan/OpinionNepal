import React, { useState } from "react";
import { toast } from "react-toastify";
import { registerUser } from "../utils/api/auth.api";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';


const Register = () => {
  const [auth, setAuth] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const navigate= useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (auth.password !== auth.confirmpassword) {
      toast.error("Passwords do not match");
      return;
    }
    else{
      try {
        const res = await registerUser({
        fullname: auth.fullname,
        username: auth.username,
        email: auth.email,
        password: auth.password,
      });
      toast.success(res.data.message);
      navigate("/login");
      } catch (error) {
        toast.error(error.response.data.message);
        toast.error("Something went wrong");
      }
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 to-red-500">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8 text-center">
          {/* Header */}
          <div className="headerdiv">
            <h1 className="text-3xl font-bold text-orange-600">OpinionNepal</h1>
            <span className="text-sm text-gray-600 mt-2 block">
              Where you're heard.
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister}>
          <div className="formdiv mt-6">
            <div className="inputfields space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-orange-600 text-left">
                  Full Name:
                </label>
                <input
                  type="text"
                  placeholder="Fullname"
                  id="fullname"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onChange={(e) =>
                    setAuth({
                      ...auth,
                      fullname: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-orange-600 text-left">
                  Username:
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  id="username"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onChange={(e) =>
                    setAuth({
                      ...auth,
                      username: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-orange-600 text-left">
                  Email:
                </label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  id="email"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onChange={(e) =>
                    setAuth({
                      ...auth,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-orange-600 text-left">
                  Password:
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onChange={(e) =>
                    setAuth({
                      ...auth,
                      password: e.target.value,
                    })
                  }
                  required
                  minLength={5}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-orange-600 text-left">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  id="confirmpassword"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onChange={(e) =>
                    setAuth({
                      ...auth,
                      confirmpassword: e.target.value,
                    })
                  }
                  required
                  minLength={5}
                />
              </div>
            </div>

            {/* Sign Up Button */}
            <button type="submit" className="w-full mt-6 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200 transform hover:scale-105">
              Sign Up
            </button>

            {/* Login Button */}
            <Link to={"/login"}>
            <button className="w-full mt-4 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition duration-200 transform hover:scale-105">
              Login to your Account
            </button>
            </Link>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;