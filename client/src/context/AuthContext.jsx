import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Ensure it's an object, not null
  isFetching: false,
  error: null
};


export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) => {
    const[state,dispatch]=useReducer(AuthReducer,INITIAL_STATE);

    useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    }
  }, []);

    return (
        <AuthContext.Provider
            value={{
                user:state.user,
                isFetching:state.isFetching,
                error:state.error,
                dispatch
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}