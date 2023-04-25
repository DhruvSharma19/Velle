import mongoose from "mongoose";



const CommentSchema=new mongoose.Schema({
    postId:{
        type:String,
        required:true,  
    },
    userId:{
        type:String,
        required:true,   
    },
    desc:{
        type:String,
        required:true,
    }
   
},{timestamps:true});

export default mongoose.model("Comment",CommentSchema);