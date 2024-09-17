const multer = require('multer');
const { storage } = require("../config/cloudConfig");
const upload = multer({storage});

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