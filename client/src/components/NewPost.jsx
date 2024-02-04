import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import { useNavigate } from "react-router-dom";
import { addPost } from "../redux/postSlice";
import Alert from "./Alert";

const Container = styled.div`
  background-color: white;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
  animation: fadein 0.3s;
  margin-top: 20px;

  @media (max-width: 468px) {
    width: 100vw;
  }
`;

const Top = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;

  img {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background-color: gray;
  }

  textarea {
    outline: none;
    border-radius: 10px;
    border: 1px solid gray;
    color: black;
    font-size: 20px;
    width: calc(100% - 40px);
    padding: 20px;
    resize: none;

    ::placeholder {
      color: gray;
      font-size: 15px;
    }
  }
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  flex-wrap: wrap;

  input {
    display: none;
  }

  button {
    color: white;
    font-weight: bold;
    border: none;
    background-color: blue;
    border-radius: 20px;
    padding: 10px 15px;
    font-size: 17px;
    letter-spacing: 1px;
    box-sizing: border-box;
    cursor: pointer;

    @media (max-width: 468px) {
      width: 100%;
    }
  }

  div {
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    border-radius: 20px;
    box-sizing: border-box;
    padding: 5px;
    font-weight: bold;

    cursor: pointer;
    :hover {
      background-color: lightgray;
    }

    img {
      height: 50px;
      width: 50px;
    }

    @media (max-width: 468px) {
      gap: 5px;
    }
  }
`;

const NewPost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [inputs, setInputs] = useState({});
  const [imgPerc, setImgPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);
  const [desc, setDesc] = useState("");
  const [open, setOpen] = useState(0);
  const [alert, setAlert] = useState("");

  const handleAlert = (err) => {
    setAlert(err.message);
    setOpen(1);
    setTimeout(() => {
      setOpen(0);
    }, 2000);
  };

  const dispatch = useDispatch();

  const handleChange = (e) => {
    if (e.target.name === "desc") {
      setDesc(e.target.value);
    }
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
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
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };

  const handlePost = async () => {
    try {
      const res = await axios.post(
        "https://velle-wtov.onrender.com/api/post",
        { ...inputs },
        { headers: { Authorization: "Bearer " + currentUser.jwt } }
      );
      dispatch(addPost(res.data));
      setImgPerc(0);
      setVideoPerc(0);
      setDesc("");
      setInputs({});
      handleAlert({ message: "Post sent" });
    } catch (err) {
      handleAlert(err);
    }
  };

  useEffect(() => {
    video && uploadFile(video, "videoUrl");
  }, [video]);

  useEffect(() => {
    img && uploadFile(img, "imgUrl");
  }, [img]);

  return (
    <Container>
      {open === 1 ? <Alert desc={alert} /> : <></>}
      <Top>
        <Link to={`/profile/${currentUser._id}`}>
          <img src={currentUser.img || "/images/profile.svg"} alt="" />
        </Link>
        <textarea
          type="text"
          placeholder="What's on your mind?"
          name="desc"
          value={desc}
          onChange={handleChange}
        />
      </Top>
      <Bottom>
        <label htmlFor="video">
          <div>
            <input
              type="file"
              accept="video/*"
              id="video"
              onChange={(e) => setVideo(e.target.files[0])}
            />
            <img src="/images/Image.svg" alt="" />
            <span>Video{videoPerc > 0 ? "-" + videoPerc + "%" : ""}</span>
          </div>
        </label>
        <label htmlFor="image">
          <div>
            <input
              type="file"
              accept="image/*"
              id="image"
              onChange={(e) => setImg(e.target.files[0])}
            />
            <img src="/images/VideoFeeling.svg" alt="" />
            <span>Photo{imgPerc > 0 ? "-" + imgPerc + "%" : ""}</span>
          </div>
        </label>
        <div>
          <img src="/images/Heart.svg" alt="" />
          <span>Feeling</span>
        </div>
        <button onClick={handlePost}>Send</button>
      </Bottom>
    </Container>
  );
};

export default NewPost;
