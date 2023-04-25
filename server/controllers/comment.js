import { createError } from "../error.js";
import Comment from "../models/Comment.js";

export const createComment=async(req,res,next)=>{
    try{
        const newComment=new Comment({...req.body , userId:req.user.id})
        const savedComment=await newComment.save();
        res.status(200).json(savedComment);
    }
    catch(err){
        next(err)
    }
}


export const deleteComment=async(req,res,next)=>{
    try{
        const comment=await Comment.findById(req.params.id)
       
        if(req.user.id===comment.userId){
            await Comment.findByIdAndDelete(req.params.id)
            res.status(200).json("The comment has been deleted")
        }
        else{
            return next(createError(403,"You can delete only your comment"));
        }

    }
    catch(err){
        next(err);
    }
}

export const updateComment=async()=>{
    try{

    }
    catch(err){
        next(err);
    }
}


export const getComment=async()=>{
    try{

    }
    catch(err){
        next(err);
    }
}
export const getComments=async(req,res,next)=>{
    try{
        const comments=await Comment.find({postId:req.params.postId})
        res.status(200).json(comments);
    }
    catch(err){
        next(err);
    }
}