import Message from "../models/Message.js"

export const createMessage=async(req,res,next)=>{
    try{
        const message=new Message(req.body);
        const savedMessage=await message.save();
        res.status(200).json(savedMessage);
    }
    catch(err){

        next(err);
    }
}


export const getMessages=async(req,res,next)=>{
    try{
        const messages=await Message.find({chatId:req.params.id});
        
        res.status(200).json(messages);
    }
    catch(err){

        next(err);
    }
}


