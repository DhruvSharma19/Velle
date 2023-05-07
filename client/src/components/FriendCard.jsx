import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Alert from './Alert';
import { useDispatch, useSelector } from 'react-redux';
import { remove } from '../redux/userSlice';


const Container=styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
  border-radius: 15px;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  animation: fadein 0.3s;
  :hover{
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
  }

  img{
    height: 80px;
    width: 80px;
    border-radius: 50%;
  }

  &>span{
    font-size: 30px;
    font-weight: bold;
    color: black;
  }

  &>div{
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;

    &>div{
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      box-sizing: border-box;


      &>h3{
        color: black;
        padding: 0px;
        margin: 0px !important;
        
      }

      &>span{
        color: gray;
        font-weight: bold;
        
      }
    }
  }


  button{
    padding: 10px;
    background-color: red;
    color: white;
    font-weight: bold;
    font-size: 20px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    outline: none;
    width: 100%;
  }

`;

const FriendCard = ({friend}) => {
  const [open,setOpen]=useState(0);
  const[alert,setAlert]=useState("");
  const {currentUser}=useSelector((state)=>state.user);

  const [user,setUser]=useState({});
  const [posts,setPosts]=useState([])
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const handleAlert=(err)=>{
    setAlert(err);
    setOpen(1);
    setTimeout(()=>{
      setOpen(0)
    },2000);
  }

  const handleRemove=async()=>{
    try{
      await axios.put(`/users/remove/${friend}`,{headers:{Authorization:"Bearer "+currentUser.jwt}});
      dispatch(remove(friend));
      handleAlert("Friend Removed");  
    }
    catch(err){
      handleAlert("error");
    }
  }

  const fetchUser=async()=>{
    try{
      const res=await axios.get(`/users/find/${friend}`);
      const res1=await axios.get(`/post/myPost/${friend}`,{headers:{Authorization:"Bearer "+currentUser.jwt}});
      setPosts(res1.data);
      setUser(res.data);
    }catch(err){
      handleAlert("error");
    }
  }

  const handleMessage=async(e)=>{
    e.preventDefault();
    try{
     
        const res=await axios.post(`/chat/create/${currentUser._id}`,{senderId:currentUser._id,recieverId:friend},{headers:{Authorization:"Bearer "+currentUser.jwt}});
        navigate(`/messenger/${currentUser._id}`);
        
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    fetchUser();
  },[friend])

  return (
    <Container>
      {open===0 ? <></>:<Alert desc={alert}/>}
      <Link to={`/profile/${friend}`}>
        <img src={user.img || "/images/profile.svg"} alt="" />
      </Link>
      <span>{user.name}</span>
      <div>
        <div>
          <h3>{user.friends?.length || 0}</h3>
          <span>Friends</span>
          
        </div>
        <div>
          <h3>{posts?.length}</h3>
          <span>Posts</span>
          
        </div>
        <div>
          <h3>{user.requests?.length || 0}</h3>
          <span>Following</span>
          
        </div>
        
      </div>

      <button onClick={handleRemove}>Remove</button>
      
      <button style={{backgroundColor:"blue"}} onClick={handleMessage}>Message</button>
      
      
    </Container>
  )
}

export default FriendCard
