import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/post.js"
import authRoutes from "./routes/auth.js"
import commentRoutes from "./routes/comment.js"
import messageRoutes from "./routes/messages.js"
import chatRoutes from "./routes/chat.js"
import cookieParser from "cookie-parser"
import cors from "cors"


const app=express();
app.use(
    cors({
        origin:["https://main--elaborate-cajeta-d20f6b.netlify.app","https://elaborate-cajeta-d20f6b.netlify.app"]
    })
)
app.use(express.json());
app.use(cookieParser())
dotenv.config();


const connect=async()=>{
    await mongoose.connect(process.env.MONGO).then(()=>{
        console.log("connected to DB.")
    }).catch((err)=>{
        console.log(err);
    })
}

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/post",postRoutes);
app.use("/api/comment",commentRoutes);
app.use("/api/message",messageRoutes);
app.use("/api/chat",chatRoutes);

app.use((err,req,res,next)=>{
    const status=err.status || 500;
    const message=err.message || "Something went wrong";

    return res.status(status).json({
        success:false,
        status,
        message,
    });
});




app.listen(8800,()=>{
    connect();
    console.log("Connected to Server");
})
