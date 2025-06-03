import{v2} from "cloudinary";
const cloudinary = v2;
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";


cloudinary.config({
  cloud_name: "dwrqlunsl",
  api_key: 196468272772582,
  api_secret: "WnN1D7VBPx1Zzt659IXRRw5WRrs",
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

