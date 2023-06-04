import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import styled from "styled-components";
import Conversation from "./Conversation";
import axios from "axios"
import { useSelector } from "react-redux";
import { io } from "socket.io-client";


const Container = styled.div`
  flex: 1.5;
  height: calc(100vh - 70px);
  box-sizing: border-box;
  overflow-y: scroll;
  background-color: #111164;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  animation:fadein 0.5s;;
  border-radius: 0px 10px 0px 0px;

  &>div{
    width: 100%;
  }

  ::-webkit-scrollbar {
    width: 5px;
  }

  @media (max-width:900px){
    min-width: 100vw;
    padding-bottom: 60px;
    display: ${(props)=>props.currentconv ? "none" : "flex"};
  }
`;

const Top = styled.div`
  width: 100%;
  box-sizing: border-box;

  div {
    font-family: "Poppins", sans-serif;
    font-size: 30px;
    font-weight: bold;
    color: white;
  }
`;

const Search = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  div {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 20px;
    img {
      width: 20%;
      height: 50px;
      border-radius: 20px 0px 0px 20px;
      border: 1px solid lightgray;
      cursor: pointer;
    }

    input {
      width: 80%;
      height: 50px;
      box-sizing: border-box;
      padding: 10px 15px;
      border-radius: 0px 20px 20px 0px;
      border: 1px solid lightgray;
      background-color: transparent;
      color: white;
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 1px;

      ::placeholder {
        font-size: 15px;
        color: lightgray;
      }
    }
  }
`;


const LatestChat = ({conversations,setCurrentconv,currentconv}) => {
  const {currentUser}=useSelector((state)=>state.user);
  const [q, setQ] = useState("");
  const socket = useRef();
  const [onlineUsers,setOnlineUsers]=useState([]);

  useEffect(()=>{
    socket.current = io("https://vellesocket.onrender.com/");
    socket.current.emit("addUser", currentUser._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(users);
    });
  },[])
  
  

  return (
    <Container currentconv={currentconv}>
      <Top>
        <div>Chats</div>
      </Top>
      <Search>
        <div>
          <img src="/images/Search.svg" alt="" />
          <input
            type="text"
            placeholder="Search Contact"
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </Search>
      

      {conversations.filter(con=>con.members[0].toLowerCase().includes(q) || con.members[1].toLowerCase().includes(q)).map((conv) => {
        return (
          <div onClick={()=>setCurrentconv(conv)}>
            
              <Conversation key={conv._id} conv={conv} onlineUsers={onlineUsers} />
            
          </div>
        );
      })}
    </Container>
  );
};

export default LatestChat;
