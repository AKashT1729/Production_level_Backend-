import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentuser,
  getUserChannelProfile,
  getWatchHistory,
  logOutUser,
  loginUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("current-user").get(verifyJWT, getCurrentuser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/avatar-upload")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-iamge")
  .patch(verifyJWT, upload.single("/coverImage"), updateUserCoverImage);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/watch-history").get(verifyJWT, getWatchHistory);
export default router;
