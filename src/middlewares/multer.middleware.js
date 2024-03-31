// Import multer for handling file uploads
import multer from "multer";

// Define storage configuration for multer
const storage = multer.diskStorage({
  // Set the destination directory for uploaded files
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Destination directory is "./public/temp"
  },
  // Set the filename for uploaded files
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename for storing the uploaded file
  },
});

// Create a multer instance with the defined storage configuration
export const upload = multer({ storage });

// Export the upload function as a named export
