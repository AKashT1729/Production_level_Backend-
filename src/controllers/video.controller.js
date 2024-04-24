import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination


});
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
