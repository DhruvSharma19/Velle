import styled from "styled-components";
import React from "react";
import RightSide from "../components/RightSide";
import LeftSide from "../components/LeftSide";
import Navbar from "../components/Navbar";
import Feed from "../components/Feed";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import app from "../firebase";
import Alert from "../components/Alert";
import { bannerUrl, imgUrl } from "../redux/userSlice";
import Update from "../components/Update";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  background-color: whitesmoke;
  min-height: 100vh;
  z-index: 99;
  padding-bottom: 10px;
  flex-wrap: wrap;
  animation: fadein 0.3s;
`;

const Main = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  min-width: 60vw;
  box-sizing: border-box;
  margin-top: 60px;
  overflow-y: scroll;
  height: calc(100vh - 60px);

  ::-webkit-scrollbar {
    width: 5px;
  }
  @media (max-width: 768px) {
    min-width: 90vw;
  }
`;

const Banner = styled.div`
  width: 100%;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 20px;
  position: relative;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 55vh;
`;

const UserImg = styled.img`
  height: 140px;
  width: 140px;
  border-radius: 10px;
`;

const BannerImg = styled.img`
  width: 100%;
  height: 50%;
  border-radius: 10px;
`;

const Name = styled.span`
  position: absolute;
  width: 300px;
  left: calc(50% - 150px);
  bottom: calc(50% - 115px);
  font-weight: bold;
  font-size: 30px;
  color: black;
  text-align: center;
`;

const User = styled.div`
  position: absolute;
  bottom: calc(50% - 75px);
  left: calc(50% - 75px);
  background-color: white;
  display: flex;
  z-index: 21;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 150px;
  width: 150px;
  border-radius: 10px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  box-sizing: border-box;
  flex-wrap: wrap;

  @media (max-width:468px){
   
    width:100%;
    justify-content: space-around;
  }
`;

const Icon = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-weight: bold;

  h4 {
    padding: 0px;
    margin: 0px;
  }
  span {
    font-size: 20px;
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  button {
    background-color: blue;
    border: none;
    outline: none;
    border-radius: 10px;

    color: white;
    font-size: 22px;
    font-weight: bold;
    cursor: pointer;

    padding: 10px 18px;
  }

  @media (max-width:468px){
   
   width:100%;
   justify-content: space-around;
 }
`;

const Bottom = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  @media (max-width:468px) {
    margin-top: 100px;
  }
`;

const Pen = styled.span`
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 200;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  border: 1px solid gray;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 20px;
    width: 20px;
    border-radius: 50%;
  }
`;

const BannerPen = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 10px;
  right: 10px;
  z-index: 200;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid gray;
  cursor: pointer;

  img {
    height: 20px;
    width: 20px;
    border-radius: 50%;
  }
`;

const Profile = () => {
  const path = useLocation().pathname.split("/")[2];

  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const [open, setOpen] = useState(0);
  const [o, setO] = useState(0);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`/users/find/${path}`,{headers:{Authorization:"Bearer "+currentUser.jwt}});
      const res1 = await axios.get(`/post/myPost/${path}`,{headers:{Authorization:"Bearer "+currentUser.jwt}});
      setUser(res.data);
      setPosts(res1.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMessage = async () => {
    try {
      await axios.post(`/chat/create/${currentUser._id}`, {
        senderId: currentUser._id,
        recieverId: path,
      },{headers:{Authorization:"Bearer "+currentUser.jwt}});
      navigate(`/messenger/${currentUser._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/users/request/${path}`,{headers:{Authorization:"Bearer "+currentUser.jwt}});
    } catch (err) {
      console.log("error");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [path]);

  return (
    <>
      <Navbar />
      <Container>

        {o === 1?<Update setO={setO}/> :""}
        {open === 1 ? <Alert desc={alert} /> : <></>}
        <LeftSide />
        <Main>
          <Banner>
            <BannerImg
              src={
                currentUser._id === path
                  ? currentUser.banner || "/images/Background.svg"
                  : user.banner || "/images/Background.svg"
              }
              alt=""
            />

            {currentUser._id === path ? (
              <BannerPen onClick={()=>setO(1)}>
                <img src="/images/Pen.svg" alt="" />
              </BannerPen>
            ) : (
              ""
            )}
            <User>
              <UserImg
                src={
                  currentUser._id === path
                    ? currentUser.img || "/images/Person.svg"
                    : user.img || "/images/Person.svg"
                }
                alt=""
              />

              {currentUser._id === path ? (
                <Pen  onClick={()=>setO(1)}>
                  <img src="/images/Pen.svg" alt="" />
                </Pen>
              ) : (
                ""
              )}
            </User>
            <Name>{user.name}</Name>
            <Bottom>
              <Left>
                <Icon>
                  <h4>{user.friends?.length || 0}</h4>
                  <span>Friends</span>
                </Icon>
                <Icon>
                  <h4>{posts?.length}</h4>
                  <span>Posts</span>
                </Icon>
                <Icon>
                  <h4>{user.requests?.length || 0}</h4>
                  <span>Following</span>
                </Icon>
              </Left>
              <Right>
                {currentUser._id === path ? (
                  ""
                ) : (
                  <button onClick={handleMessage}>Message</button>
                )}
                
                {currentUser.friends?.includes(path) ? (
                  <button>Following</button>
                ) : user.requests?.includes(currentUser._id) ? (
                  <button>Pending</button>
                ) : (
                  currentUser._id==path ?<></>:
                  <button onClick={handleRequest}>Follow</button>
                )}
              </Right>
            </Bottom>
          </Banner>
          <Feed />
        </Main>

        <RightSide />
      </Container>
    </>
  );
};

export default Profile;
