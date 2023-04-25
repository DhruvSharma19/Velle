import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {useSelector} from "react-redux"
import axios from "axios"


const Person = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 10px;
  animation: fadein 0.3s;

  :hover {
    background-color: #3d3dae;
  }

 

    img {
      height: 60px;
      width: 60px;
      border-radius: 50%;
      cursor: pointer;
    }
  
`;

const Left=styled.div`
display: flex;
flex-direction: row;
align-items: center;
gap: 10px;
`;

const Right=styled.div`
display: flex;
align-items: center;
justify-content: center;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: ${(props)=>props.onlineUsers.findIndex((u)=>u.userId===props.user._id) === -1?"red":"blue"}
  
`;

const Conversation = ({conv,onlineUsers}) => {

    const {currentUser}=useSelector((state)=>state.user);
    const [user,setUser]=useState({});

    const fetchUser=async()=>{
        const friends= conv.members.find((m)=>m!==currentUser._id)

        try{
            const res=await axios.get(`/users/find/${friends}`);
            setUser(res.data);
        }
        catch(err){
            console.log(err);
        }
    }


    useEffect(()=>{
        fetchUser();
    },[conv])


  return (
    <Person>
      <Left>

      <div>
        <img src={user.img || "/images/Person.svg"} alt="" />
      </div>
      <div>
        <span
          style={{
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
          }}
          >
          {user.name}
        </span>
        
      </div>
          </Left>
          <Right onlineUsers={onlineUsers} user={user}>

          </Right>
    </Person>
  );
};

export default Conversation;
