import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
  cloud_name:  process.env.CLOUD_NANE, 
  api_key: process.env.API_KEY_CLOUDINARY, 
  api_secret: process.env.API_SECRET_CLOUDINARY
});