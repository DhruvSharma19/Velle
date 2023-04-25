import express from "express"
import { addFriend, deleteUser, getFriends, getUser, getUsers, rejectRequest, removeFriend, requestFriend, updateUser,random } from "../controllers/user.js";
import {verifyToken} from "../verifyToken.js"

const router = express.Router();


router.delete("/:id",verifyToken,deleteUser);
router.put("/:id",verifyToken,updateUser);
router.get("/find/:id",getUser);
router.get("/search",getUsers);
router.put("/accept/:id",verifyToken,addFriend);
router.put("/request/:id",verifyToken,requestFriend);
router.put("/reject/:id",verifyToken,rejectRequest);
router.put("/remove/:id",verifyToken,removeFriend);
router.get("/friend/:id",verifyToken,getFriends);
router.get("/random/:id",verifyToken,random);


export default router