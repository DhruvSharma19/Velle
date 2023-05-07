import express from "express"
import { createPost, deletePost, getPosts, like, myPosts, updatePost } from "../controllers/post.js";
import {verifyToken} from "../verifyToken.js"

const router = express.Router();


router.post("/",verifyToken ,createPost);
router.put("/:id",verifyToken,updatePost);
router.delete("/:id",verifyToken,deletePost);
router.get("/random",getPosts);
router.put("/like/:id",verifyToken,like);
router.get("/myPost/:id",myPosts);


export default router 