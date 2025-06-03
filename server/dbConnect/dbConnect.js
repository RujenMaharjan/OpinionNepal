import mongoose from "mongoose";

export const dbConnect = () => {
    try{
        mongoose.connect(process.env.DB_URL);
        console.log("database has been connected succesfully.");
    }catch(error)
    {
        console.log(error);
    }
};