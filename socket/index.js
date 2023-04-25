const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000"
    }
})

let users = [];


const addUser = (userId, socketId) => { 
    if(users.some((user)=>user.userId===userId)){
        users.splice(
            users.findIndex((user)=>user.userId==userId),1
        )
        users.push({userId,socketId});
    }
    else{
        users.push({userId,socketId});
    }
    
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    
    return users.find((user) => user.userId === userId)
    
    
}

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("addUser", userId => {
        addUser(userId, socket.id);
        io.emit("getUsers", users); 
    });


    socket.on("sendMessage", ({ senderId, recieverId, desc,imgUrl,videoUrl }) => {
       
        const user = getUser(recieverId);
        if(user){
            io.to(user.socketId).emit("getMessage", {
                senderId, desc,imgUrl,videoUrl
            })
        }
    })

   


    socket.on("disconnect", () => {
        console.log("a user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);

    })
})