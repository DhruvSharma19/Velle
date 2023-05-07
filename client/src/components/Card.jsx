import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import {useDispatch, useSelector} from "react-redux"
import Alert from "../components/Alert"
import { accept, reject } from '../redux/userSlice';
import {Link} from "react-router-dom"


const Request = styled.div`
  background-color: white;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  gap: 20px;
  overflow: hideen;
  transition:all ease 0.2s;
  cursor:pointer;
  animation: fadein 0.3s;
  :hover{
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
  }

  span{
    margin-top:30px;
    padding-left:20px;
    font-size:20px;
    font-weight:bold;
    color:black;
  }


  

`;

const Top=styled.div`
height:50%;
width:100%;
border-radius:20px;
position:relative;

div{
  position:absolute;
  left:calc(50% - 40px);
  bottom:-40px;
  z-index:20;
  height:90px;
  width:90px;
  border-radius:50%;
  background-color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  img{
    height:80px;
    width:80px;
    border-radius:50%;
    }
}
`;


const Bottom=styled.div`
  display:flex;
  flex-direction:row;
  width:100%;
  align-items:center;
  gap:20px;
  flex-wrap:wrap;

  button{
    padding:10px;
    border:none;
    color: white ;
    border-radius:20px;
    font-size:20px;
    font-weight:bold;
    outline:none;
    cursor:pointer;
    flex:1;
  }

`;

const Banner=styled.img`
  position: absolute;
  top: 0px;
  width: 100%;

  border-radius: 20px;
  height: 100%;
`;


const Alert1=styled.div`
  font-size: 25px;
  color: white;
  border-radius:20px ;
  background-color: blue;
  padding: 10px;
  box-sizing: border-box;
  font-weight: bold;
  text-align: center;
`;

const Card = ({user}) => {

  const {currentUser}=useSelector((state)=>state.user);
  const [open,setOpen]=useState(0);
  const[alert,setAlert]=useState("");

  const dispatch=useDispatch();
  

  const handleAlert=(err)=>{
    setAlert(err);
    setOpen(1);
    setTimeout(()=>{
      setOpen(0)
    },2000);
    
  }


    const handleReject=async()=>{
        try{
          await axios.put(`/users/reject/${user._id}`,{headers:{Authorization:"Bearer "+currentUser.jwt}});
          dispatch(reject(user._id))
          handleAlert("Request Rejected")
        }
        catch(err){
          handleAlert("error");
        }
    
      }
    
      const handleRequest=async()=>{
        await axios.put(`/users/request/${user._id}`,{headers:{Authorization:"Bearer "+currentUser.jwt}});
        handleAlert("Request has been sent.")
    
        try{
    
        }
        catch(err){
          handleAlert("error");
        }
    
      }
    
      const handleAccept=async()=>{
        try{
            await axios.put(`/users/accept/${user._id}`,{headers:{Authorization:"Bearer "+currentUser.jwt}});
            dispatch(accept(user._id));
            handleAlert("Request Accepted");
        }
        catch(err){
          handleAlert("error");
        }
      }

      

  return (
    <Request> 
      {open === 0 ? <></>:<Alert desc={alert}/>}
            
            <Top>
              <Banner src={user.banner ? user.banner : "/images/Background.svg"}>
                
              </Banner>

              <div>
                <Link to={`/profile/${user._id}`}>
                  <img src={user.img || "/images/Person.svg"} alt="" />
                </Link>
                
              </div>

            </Top>
            <span>{user.name}</span>
            {currentUser.friends.includes(user._id) ? <Alert1>You Both are friends</Alert1>:
            <>
              <Bottom>
                {currentUser.requests.includes(user._id) ? 
                  <button style={{backgroundColor:"green"}} onClick={handleAccept}>Accept</button>:""
                }
                {user.requests.includes(currentUser._id) ? <Alert1>Request Sent</Alert1> :
                  <button style={{backgroundColor:"blue"}} onClick={handleRequest} >Request</button>
                }
                {currentUser.requests.includes(user._id) ? 
                  
                  <button style={{backgroundColor:"red"}} onClick={handleReject} >Reject</button>:""
                }
              </Bottom>
            </>
            }
    </Request>
  )
}

export default Card
