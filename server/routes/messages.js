import express from "express"
import { verifyToken } from "../verifyToken.js";
import { createMessage, getMessages } from "../controllers/message.js";

const router = express.Router();


router.post("/create/:id", verifyToken, createMessage);
// router.delete("/delete",verifyToken,deleteChat);
router.get("/get/:id", verifyToken, getMessages);

export default router  