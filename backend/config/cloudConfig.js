const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const {CloudinaryStorage} = require("multer-storage-cloudinary")

cloudinary.config({
  cloud_name: "dpj8xt6rv",
  api_key: "499445277343462",
  api_secret: "1yKs8wZBTZYwogsSzuSWw_c5zW0",
});

// console.log(process.env.CLOUDINARY_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);
const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : "FlexiTask",
        allowed_formats : ["jpg", "jpeg","png","zip","pdf","webp"]
    }
})

module.exports = {
    storage,cloudinary,
}

