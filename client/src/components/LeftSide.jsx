import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { io } from "socket.io-client";
import Online from "./Online";
import Alert from "./Alert";

const Container = styled.div`
  margin-top: 60px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  padding-left: 5px;
  animation: fadein 0.3s;
`;

const Card = styled.div`
  border-radius: 15px;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Banner = styled.div`
  width: 100%;
  position: relative;
  border-radius: 20px;
  margin-bottom: 20px;
  & > img {
    width: 100%;
    height: 100px;
    border-radius: 20px;
  }

  & > div {
    position: absolute;
    bottom: -20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 20px;
    left: calc(50% - 30px);
    width: 60px;
    height: 60px;

    img {
      width: 50px;
      height: 50px;
      cursor: pointer;
      border-radius: 20px;
    }
  }
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  & > span {
    font-size: 25px;
    font-weight: bold;
  }
`;

const Icons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Active = styled.div`
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background-color: white;
  border-radius: 20px;
`;

const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  gap: 10px;
  max-height: 30vh;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 5px;
  }
`;

const Nothing = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: gray;
  text-align: center;
`;

const LeftSide = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPost] = useState([]);
  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [open, setOpen] = useState(0);
  const [alert, setAlert] = useState("");

  const handleAlert = (err) => {
    setAlert(err);
    setOpen(1);
    setTimeout(() => {
      setOpen(0);
    }, 2000);
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`https://velle-wtov.onrender.com/api/post/myPost/${currentUser._id}`,{headers:{Authorization:"Bearer "+currentUser.jwt}});
      setPost(res.data);
    } catch (err) {
      handleAlert("error");
    }
  };

  useEffect(() => {
    fetchPosts();
    try {
      socket.current = io("https://vellesocket.onrender.com/");
      socket.current.emit("addUser", currentUser._id);
      socket.current.on("getUsers", (users) => {
        setOnlineUsers(users);
      });
    } catch (err) {
      handleAlert("error");
    }
  }, []);
  return (
    <Container>
      {open === 1 ? <Alert desc={alert} /> : <></>}
      <Card>
        <Banner>
          <img src={currentUser.banner || "/images/Background.svg"} alt="" />
          <div>
            <Link to={`/profile/${currentUser._id}`}>
              <img src={currentUser.img || "/images/Person.svg"} alt="" />
            </Link>
          </div>
        </Banner>
        <Center>
          <span>{currentUser.name}</span>
          <Icons>
            <div>
              <h3>Friends</h3>
              <div>{currentUser.friends?.length || 0}</div>
            </div>
            <div>
              <h3>Posts</h3>
              <div>{posts?.length || 0}</div>
            </div>
            <div>
              <h3>Following</h3>
              <div>{currentUser.requests?.length || 0}</div>
            </div>
          </Icons>
        </Center>
      </Card>
      <Active>
        <List>
          {currentUser.friends.length === 0 ? (
            <Nothing>Nothing To Show</Nothing>
          ) : (
            ""
          )}
          {currentUser.friends.map((friend) => {
            return (
              <Link
                style={{ textDecoration: "none" }}
                to={`/profile/${friend}`}
              >
                <Online
                  key={friend}
                  friend={friend}
                  onlineUsers={onlineUsers}
                />
              </Link>
            );
          })}
        </List>
      </Active>
    </Container>
  );
};

export default LeftSide;
