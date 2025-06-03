import React, { useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextProvider } from "../context/AuthContext";
import { LoginAction } from "../utils/api/auth.api";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [auth, setAuth] = useState({
    email: "",
    password: "",
  });

const{user, isFetching, error, dispatch}=useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
     await LoginAction({email:auth.email,password:auth.password},dispatch);
  };

  useEffect(() => {
    if (error) {
      toast.error("Log In Failed. Please check your credentials and try again.");
    }
  }, [error]);


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
          <div className="formdiv mt-6">
            <form onSubmit={handleLogin}>
            
            <div className="inputfields space-y-4">
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
                      email: e.target.value
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
                      password: e.target.value 
                      })
                  }
                  required
                  minLength={2}
                />
              </div>
            </div>

            {/* Login Button */}
            <button className="w-full mt-6 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200 transform hover:scale-105">
              {isFetching ? "Logging In" : "Login"}
            </button>

            {/* Sign Up Link */}
           
              <Link to={"/register"}>
              <p className="mt-4 text-sm text-gray-600">
                  Don't have an account?{" "}
                    <Link to={"/register"} className="text-orange-500 hover:underline">
                      Sign Up
                    </Link>
              </p>
              </Link>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;