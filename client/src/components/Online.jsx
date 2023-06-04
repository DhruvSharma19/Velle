import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";





const Item=styled.div`
width: 100% ;
display: flex;
flex-direction: row;
gap: 10px;
align-items: center;
justify-content: space-between;
border-radius: 5px;
padding: 5px 10px;
cursor: pointer;
:hover{
  background-color: whitesmoke;
}

div{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

div>img{
  height: 30px;
  width: 30px;
  border-radius: 20px;
  cursor: pointer;

}

div>span{
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none !important;
  color: black;
}

`;

const Sign=styled.span`
  border-radius: 50%;
  height: 20px;
  width: 20px;
  background-color: ${(props)=>props.onlineUsers.findIndex((user)=>user.userId===props.friend) === -1?"red":"blue"};
`;



const Online = ({friend,onlineUsers}) => {
    const {currentUser}=useSelector((state)=>state.user);
    const [user,setUser]=useState({});

    const fetchUser=async()=>{
        try{
            const res=await axios.get(`https://velle-wtov.onrender.com/api/users/find/${friend}`,{headers:{Authorization:"Bearer "+currentUser.jwt}});
            setUser(res.data);
        }
        catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchUser();
    },[])
  return (
    <Item>
      <div>
        <img src={user.img || "/images/Person.svg"} alt="" />
        <span>{user.name}</span>
      </div>
      <Sign onlineUsers={onlineUsers} friend={friend}></Sign>
    </Item>
  );
};

export default Online;
