import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {format} from "timeago.js"

const Container = styled.div`
  width: 100%;
  animation: fadein 0.3s;
  overflow-x: hidden;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  gap: 5px;
  /* overflow-y: hidden; */
  box-sizing: border-box;
  padding: 10px;
  text-align: left;
  
  border-radius: 0px 10px 10px 10px;
  animation: fadein 0.3s;

  div{
    text-align: left;
    font-size: 13px;
    font-weight: bold;
  }

  span {
    background-color: lightgray;
    max-width: 40vw;
    padding: 10px;
    box-sizing: border-box;
    font-size: 20px;
    font-weight: bold;
    color: black;
    border-radius: 0px 10px 10px 10px;
    
  }

`;


const Wrapper2 = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  box-sizing: border-box;
  padding: 20px;
  /* overflow-y: hidden; */

  div{
    text-align: right;
    font-size: 13px;
    font-weight: bold;
  }
  
  border-radius: 10px 0px 10px 10px;
  animation: fadein 0.3s;

  span {
    background-color: #47bdf0;
    max-width: 40vw;
    padding: 10px;
    box-sizing: border-box;
    font-size: 20px;
    font-weight: bold;
    color: black;
    border-radius: 10px 0px 10px 10px;

    
  }
`;

const Image = styled.div`
  max-width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
    border-radius: 20px;
  }
`;

const Video = styled.div`
display: flex;
  align-items: center;
  justify-content: center;
  max-width: 50%;
  border-radius: 20px;
  
  video{
    width: 100%;
    height: 100%;
    border-radius: 20px;
    overflow: hidden;
  }
`;



const Message = ({ message, friend }) => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Container>
      {message.senderId !== currentUser._id ? (
        <Wrapper>
          
          {message.imgUrl ? (
            <Image>
              <img src={message.imgUrl} alt="" />
            </Image>
          ) : (
            ""
          )}
          {message.videoUrl ? (
            <Video>
              <video src={message.videoUrl} controls></video>
            </Video>
          ) : (
            ""
          )}

          {
            message.desc ?
            <span>{message.desc}</span>:""
          }
          <div>{format(message.createdAt)}</div>
        </Wrapper>
      ) : (
        <Wrapper2>
          
          {message.imgUrl ? (
            <Image>
              <img src={message.imgUrl} alt="" />
            </Image>
          ) : (
            ""
          )}
          {message.videoUrl ? (
            <Video>
              <video src={message.videoUrl} controls></video>
            </Video>
          ) : (
            ""
          )}
         {
          message.desc ?
           <span>{message.desc}</span>:""
         }
         <div>{format(message.createdAt)}</div>
        </Wrapper2>
      )}
    </Container>
  );
};

export default Message;
