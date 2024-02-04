import express from "express"
import { createComment, deleteComment, getComment, getComments, updateComment } from "../controllers/comment.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.post("/create", verifyToken, createComment);
router.delete("/delete/:id", verifyToken, deleteComment);
router.put("/update", verifyToken, updateComment);
router.get("/get", getComment);
router.get("/getAll/:postId", getComments);

export default router;