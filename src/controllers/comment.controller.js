import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getVideoComments = asyncHandler(async (req, res) => {
  // get all comments for the video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const comments = await Comment.find({
    video: videoId,
  })
    .skip((page - 1) * limit)
    .limit(limit);
  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments retrieved successfully"));
});
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content, owner } = req.body;
  const newComment = new Comment({
    video: videoId,
    content,
    owner,
  });
  const savedComment = await newComment.save();
  return res
    .status(200)
    .json(new ApiResponse(201, savedComment, "Comment added successfully"));
});
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content,
    },
    { new: true, runValidators: true }
  );
  if (!updatedComment) {
    throw new ApiError(404, "Comment not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if (!deletedComment) {
    throw new ApiError(404, "Comment not found");
  }
  return res.status(200).json(new ApiResponse(200, null, "Comment deleted"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
