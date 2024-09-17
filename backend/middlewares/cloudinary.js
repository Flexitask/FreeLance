const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(process.env.CLOUDINARY_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);


const uploadClientImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "client/images",
    });
    return { url: result.secure_url };
  } catch (error) {
    return { error: error.message };
  }
};

const uploadDeveloperImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "dev/images",
    });
    return { url: result.secure_url };
  } catch (err) {
    return { error: err.message };
  }
};

const uploadClientZip = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'client/zips',
      resource_type: 'raw',
    });
    return { url: result.secure_url };
  } catch (err) {
    return { error: err.message };
  }
}

const uploadDeveloperZip = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'dev/zips',
      resource_type: 'raw',
    });
    return { url: result.secure_url };
  } catch (err) {
    return { error: err.message };
  }
}

module.exports = {
  uploadClientImage,
  uploadDeveloperImage,
  uploadClientZip,
  uploadDeveloperZip,
};