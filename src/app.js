import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


//routes import
import userRouter from './routes/user.routes.js'
import commentRouter from './routes/comment.routes.js'
import videoRouter from './routes/video.routes.js'
//routes declarations
app.use("/api/v1/users", userRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/video", videoRouter)

//http://localhost:8000/api/v1/users/register

export { app };
