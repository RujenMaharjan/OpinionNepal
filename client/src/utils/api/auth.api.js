import { API } from "./api";

export const LoginAction = async (userInfo, dispatch) => {
    dispatch({ type: "LOGIN_START" });
    try {
        const res = await API.post("/auth/login", userInfo);
        const userData = res.data.userData; // Extract only userData

        localStorage.setItem("user", JSON.stringify(userData)); // Store only userData

        dispatch({
            type: "LOGIN_SUCCESS",
            payload: userData, // Send only userData
        });
    } catch (error) {
        dispatch({
            type: "LOGIN_FAILURE",
            payload: error,
        });
    }
};


export const logoutUser = (dispatch) => {
  localStorage.removeItem("user"); 
  dispatch({ type: "LOGOUT" });
};

export const registerUser= (data) => API.post("/auth/register", data);