import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
    },
    senderId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
    },
    imgUrl: {
        type: String,
    },
    videoUrl: {
        type: String,
    }
}, { timestamps: true });


export default mongoose.model("Message", MessageSchema); 