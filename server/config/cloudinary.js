import{v2} from "cloudinary";
const cloudinary = v2;
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";


cloudinary.config({
  cloud_name: "",
  api_key: 1,
  api_secret: "",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "OpinionNepal",
    resource_type: "image",
  },
});

const parser = multer({ storage: storage });

export{
    cloudinary,
    parser,
};

