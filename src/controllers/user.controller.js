import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findOne(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Error generating while generating refresh tokens and access tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation - check field is not empty
  //check if user already exists : username and email
  //check for images , check avatar
  //upload them into cloudinary ,avatar
  //create user object - create entry in database
  //remove password and refresh token field from response
  //check for user creation
  //retun response

  const { fullName, email, username, password } = req.body;
  //console.log(fullName, email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Please fill all the fields");
  }

  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (userExists) {
    throw new ApiError(409, "User already exists");
  }
  // console.log(req.files)
  const avatarLocalPath = req.files?.avatar[0]?.path; //ensures that if req.files is null or undefined, the code doesn't throw an error but instead returns undefined

  //const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Please upload an avatar");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // console.log(avatar);
  if (!avatar) {
    throw new ApiError(400, "Please upload an avatar");
  }

  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar,
    coverImage: coverImage || "",
  });

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createUser) {
    throw ApiError(500, "User not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createUser, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //get login user details from frontend username or email and password
  //check if user is already registered or not
  //if yes,then login user
  //then check user password
  //if password is incorrect, then return error message
  //if password is correct, then create access token and refresh token return it
  //send cookie
  //retun response
  const { email, username, password } = req.body;
  // console.log(username, password);
  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const optons = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, optons)
    .cookie("refreshToken", refreshToken, optons)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user logged in successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );
  const optons = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", optons)
    .clearCookie("refreshToken", optons)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "unauthorized request");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired ");
    }
    const optons = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);
    return res
      .status(200)
      .cookie("accessToken", user.accessToken, optons)
      .cookie("refreshToken", user.newRefreshToken, optons)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "refresh token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});
export { registerUser, loginUser, logOutUser ,refreshAccessToken };
