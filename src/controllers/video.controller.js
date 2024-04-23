import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {});
const publishVideo = asyncHandler(async (req, res) => {});
const getVideoById = asyncHandler(async (req, res) => {});
const updateVideo = asyncHandler(async (req, res) => {});
const deletedVideo = asyncHandler(async (req, res) => {});
const togglePublishStatus = asyncHandler(async (req, res) => {});

export {
  getAllVideos,
  getVideoById,
  togglePublishStatus,
  deletedVideo,
  updateVideo,
  publishVideo,
};
