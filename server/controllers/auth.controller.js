//Register
import UserModel from "../models/user.model.js"
import bcrypt from 'bcrypt';
import { loginUser, registerUser } from "../services/auth.service.js";

export const register= async(req,res)=>{
    try{
        const newUser= await registerUser(req.body);
        const{password,...data}=newUser._doc;
        res.status(200).json(
            {
                data,
                message:"User has been registered succesfully",
            }
        )
    }catch(error){
        res.status(500).json(
            {
                error:error,
                message:"Error Occoured Registering User",
            }
        );
        console.log(error);
    }
};

export const login= async(req,res)=>{
    try{
        const loggedInUser = await loginUser(req.body);
        const{password,...data}=loggedInUser._doc;
        res.status(200).json({
            message:"Logged in succesfully",
            data,
        });
        
    }catch(error){
        res.status(500).json(
            {
                error:error,
                message:"Error Occourerd Logging User In",
            }
        );
        console.log(error);
    }
}
