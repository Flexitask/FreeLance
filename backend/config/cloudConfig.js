const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const {CloudinaryStorage} = require("multer-storage-cloudinary")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log(process.env.CLOUDINARY_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);
const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : "FlexiTask",
        allowed_formats : ["jpg", "jpeg","png","zip"]
    }
})

module.exports = {
    storage,cloudinary,
}

