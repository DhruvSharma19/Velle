import Chat from "../models/Chat.js";

export const createChat=async(req,res,next)=>{
    try{ 
            const chat=new Chat({
                members:[req.body.senderId,req.body.recieverId]
            });
            const savedChat=await chat.save();
            res.status(200).json(savedChat);
        
    }
    catch(err){

        next(err);
    }
}

export const deleteChat=async()=>{
    try{

    }
    catch(err){
 
        console.log(err);
    }
}


export const getChat=async(req,res,next)=>{
    try{
        const chats=await Chat.find({members:{$in:[req.params.id]}});
        res.status(200).json(chats);
    }
    catch(err){

        next(err);
    }
}