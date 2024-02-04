import express from "express"
import { verifyToken } from "../verifyToken.js";
import { createChat, deleteChat, getChat } from "../controllers/chat.js";

const router = express.Router();


router.post("/create/:id", verifyToken, createChat);
// router.delete("/delete",verifyToken,deleteChat);
router.get("/get/:id", verifyToken, getChat);

export default router  