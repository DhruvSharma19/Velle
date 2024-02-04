import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    members: {
        type: Array,
        required: true,
    }
}, { timestamps: true });


export default mongoose.model("Chat", ChatSchema); 