import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NANE,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_CLOUDINARY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("file is uploaded on cloudinary ", uploadResult.url);
    return uploadResult.url;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the upload
    console.log(error);
    return null;
  }
};

export default uploadOnCloudinary;
