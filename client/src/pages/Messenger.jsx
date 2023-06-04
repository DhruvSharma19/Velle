import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Chat from "../components/Chat";
import LatestChat from "../components/LatestChat";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router";
import axios from "axios";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const Container = styled.div`
  width: 100vw;
  margin-top: 70px;
  display: flex;
  flex-direction: row;
  animation: fadein 0.3s;
  flex-wrap: wrap;
`;

const Nothing=styled.div`
flex: 3;
background-color: white;
color: gray;
font-weight: bold;
display: flex;
align-items: center;
justify-content: center;
font-size: 40px;

@media (max-width:900px){
  display: none;
}
`;

const Messenger = () => {
  const {currentUser}=useSelector((state)=>state.user);
  const path = useLocation().pathname.split("/")[2];
  const [conversations, setConversations] = useState([]);
  const [currentconv, setCurrentconv] = useState(null);
  

  

  const fetchChats = async () => {
    try {
      const res = await axios.get(`https://velle-wtov.onrender.com/api/chat/get/${path}`,{headers:{Authorization:"Bearer "+currentUser.jwt}});
      setConversations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [path, currentconv]);
 
  return (
    <>
      <Navbar />
      <Container>
        

        <LatestChat
        conversations={conversations}
        setCurrentconv={setCurrentconv}
        currentconv={currentconv}
        />
      
       
        { currentconv ?
          <Chat currentconv={currentconv} setCurrentconv={setCurrentconv}/>:
          <Nothing>Nothing To Show</Nothing>
        }
        
       
      </Container>
    </>
  );
};

export default Messenger;
