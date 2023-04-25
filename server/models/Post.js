import mongoose  from "mongoose";

const PostSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    imgUrl:{ 
        type:String,

    },
    videoUrl:{
        type:String,
    },
    desc:{
        type:String,
    },
    likes:{
        type:Array,
        
    },
},{timestamps:true});


export default mongoose.model("Post",PostSchema);