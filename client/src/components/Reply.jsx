import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {Link} from "react-router-dom"
import { useSelector } from 'react-redux';

const Container=styled.div`
    padding: 8px;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    animation: fadein 0.3s;
  
    gap: 10px;

    &>div{
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      

      span{
        font-weight: 20px; 
        color: black;
        font-weight: bold;
      }

      div{
        font-size: 15px;
        color: gray;
        font-weight: bold;
      }

    }

    img{
        width: 30px;
        cursor: pointer;
        height: 30px;
        border-radius: 10px;
        border: 1px solid gray;
    }

    
`;

const Reply = ({c}) => {
  const {currentUser}=useSelector((state)=>state.user);
  const [user,setUser]=useState({});

  const fetchUser=async()=>{
    try{
      const res=await axios.get(`https://velle-wtov.onrender.com/api/users/find/${c.userId}`,{headers:{Authorization:"Bearer "+currentUser.jwt}});
      setUser(res.data);

    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    fetchUser();
  },[c])
  return (
    <Container>
      <Link to={`/profile/${user._id}`}>
        <img src={user.img || "/images/Person.svg"} alt="" />
      </Link>
      <div>
        <div>{user.name}</div>
        <span>{c.desc}</span>
      </div>
      
    </Container>
  )
}

export default Reply
