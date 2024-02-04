import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Message from "./Message";
import axios from "axios";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import Alert from "../components/Alert";

const Container = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 70px);
  box-sizing: border-box;
  overflow-x: hidden;
  animation: fadein 0.5s;
  @media (max-width: 900px) {
    min-width: 100vw;
    padding-bottom: 60px;
  }
`;

const Top = styled.div`
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  border-bottom: 1px solid lightgray;
  height: 100px;
  overflow: hidden;
`;

const Left = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  & > img {
    display: none;
    height: 30px;
    width: 30px;
    cursor: pointer;

    @media (max-width: 900px) {
      display: flex;
    }
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    img {
      height: 60px;
      width: 60px;
      border-radius: 5px;
      cursor: pointer;
    }

    span {
      font-weight: bold;
      font-size: 20px;
    }
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;

  div {
    height: 50px;
    width: 50px;
    background-color: lightgray;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 10px;

    img {
      height: 40px;
      width: 40px;
      cursor: pointer;
    }
  }
`;

const Main = styled.div`
  box-sizing: border-box;
  height: calc(100% - 200px);
  background-color: #d3f2f7;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  overflow-y: scroll;

  div {
    width: 100%;
  }

  ::-webkit-scrollbar {
    width: 5px;
  }
`;

const Perc = styled.span`
  position: absolute;
  top: -16px;
  font-weight: bold;
`;

const Bottom = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;

  input {
    width: 60%;
    padding: 10px;
    border-radius: 20px;
    border: 1px solid gray;
    outline: blue;
    font-size: 20px;
    letter-spacing: 1px;
    font-weight: bold;
    color: black;
    background-color: whitesmoke;
  }

  button {
    flex: 1;
    padding: 10px;
    border: none;
  }
`;

const Icon = styled.div`
  font-size: 8;
  height: 50px;
  width: 50px;
  border-radius: 20px;
  background-color: lightgray;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  img {
    height: 40px;
    width: 40px;
  }
`;

const Chat = ({ currentconv, setCurrentconv }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [q, setQ] = useState("");
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [friend, setFriend] = useState({});
  const socket = useRef();
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);
  const [imgUrl, setImgUrl] = useState(null);
  const [vidUrl, setVidUrl] = useState(null);
  const [open, setOpen] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [alert, setAlert] = useState("");

  const handleAlert = (err) => {
    setAlert(err.message);
    setOpen(1);
    setTimeout(() => {
      setOpen(0);
    }, 2000);
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "imgUrl"
          ? setImgPerc(Math.round(progress))
          : setVideoPerc(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        handleAlert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (urlType === "imgUrl") {
            setImgUrl(downloadURL);
          } else {
            setVidUrl(downloadURL);
          }
        });
      }
    );
  };

  useEffect(() => {
    video && uploadFile(video, "videoUrl");
  }, [video]);

  useEffect(() => {
    img && uploadFile(img, "imgUrl");
  }, [img]);

  useEffect(() => {
    socket.current = io("https://vellesocket.onrender.com/");
    socket.current?.on("getMessage", (data) => {
      setArrivalMessage({
        senderId: data.senderId,
        desc: data.desc,
        imgUrl: data.imgUrl,
        videoUrl: data.videoUrl,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    socket.current.emit("addUser", currentUser._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(users);
    });
  }, [currentUser]);

  const fetchMessages = async () => {
    const f = currentconv?.members?.find((id) => id !== currentUser._id);

    try {
      const res = await axios.get(
        `https://velle-wtov.onrender.com/api/message/get/${currentconv._id}`,
        { headers: { Authorization: "Bearer " + currentUser.jwt } }
      );
      if (f) {
        const res1 = await axios.get(
          `https://velle-wtov.onrender.com/api/users/find/${f}`,
          { headers: { Authorization: "Bearer " + currentUser.jwt } }
        );
        setFriend(res1.data);
      }
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    const recieverId = currentconv.members.find(
      (member) => member !== currentUser._id
    );
    if (recieverId) {
      socket.current.emit("sendMessage", {
        senderId: currentUser._id,
        recieverId,
        desc: q,
        imgUrl: imgUrl,
        videoUrl: vidUrl,
      });
    }

    try {
      const res = await axios.post(
        `https://velle-wtov.onrender.com/api/message/create/${currentconv._id}`,
        {
          chatId: currentconv._id,
          senderId: currentUser._id,
          desc: q,
          imgUrl: imgUrl,
          videoUrl: vidUrl,
        },
        { headers: { Authorization: "Bearer " + currentUser.jwt } }
      );
      setImgPerc(0);
      setQ("");
      setVideoPerc(0);
      setImg(null);
      setVideo(null);
      setMessages([...messages, res.data]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    arrivalMessage &&
      currentconv?.members.includes(arrivalMessage.senderId) &&
      setMessages([...messages, arrivalMessage]);
  }, [arrivalMessage, currentconv]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchMessages();
  }, [currentconv]);

  return (
    <Container>
      {open === 1 ? <Alert /> : ""}
      <Top>
        <Left>
          <img
            src="/images/Back.svg"
            alt=""
            onClick={() => {
              setCurrentconv(null);
            }}
          />

          <div>
            <img src={friend.img || "/images/Person.svg"} alt="" />
          </div>
          <div>
            <span>{friend.name}</span>
            <span style={{ fontSize: "15px" }}>
              {onlineUsers.findIndex((u) => u.userId === friend._id) === -1
                ? "Not Active"
                : "Active"}
            </span>
          </div>
        </Left>
        <Right>
          <div>
            <img src="/images/Phone.svg" alt="" />
          </div>
          <div>
            <img src="/images/Video2.svg" alt="" />
          </div>
        </Right>
      </Top>
      <Main>
        {messages.map((message) => {
          return (
            <div ref={scrollRef}>
              <Message key={message._id} message={message} friend={friend} />
            </div>
          );
        })}
      </Main>
      <Bottom>
        <label htmlFor="image">
          <Icon>
            <input
              style={{ display: "none" }}
              type="file"
              accept="image/*"
              id="image"
              onChange={(e) => setImg(e.target.files[0])}
            />
            {imgPerc > 0 ? <Perc>Image:{imgPerc}%</Perc> : ""}
            <img src="/images/Photo.svg" alt="" />
          </Icon>
        </label>
        <label htmlFor="video">
          <Icon>
            <input
              type="file"
              style={{ display: "none" }}
              accept="video/*"
              id="video"
              onChange={(e) => setVideo(e.target.files[0])}
            />
            {videoPerc > 0 ? <Perc>Video:{videoPerc}%</Perc> : ""}
            <img src="/images/Vid.svg" alt="" />
          </Icon>
        </label>
        <input type="text" onChange={(e) => setQ(e.target.value)} value={q} />

        <Icon style={{ backgroundColor: "blue" }} onClick={handleSend}>
          <img src="/images/Send.svg" alt="" />
        </Icon>
      </Bottom>
    </Container>
  );
};

export default Chat;
