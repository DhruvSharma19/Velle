import React from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import styled from "styled-components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bannerUrl, imgUrl } from "../redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import Alert from "./Alert";

const Container = styled.div`
  position: fixed;
  animation: fadein 0.3s;
  z-index: 99;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;

  background-color: #00000034;
  display: flex;
  align-items: center;
  justify-content: center;

  button{
    font-size: 20px;
    font-weight: bold;
    color: white;
    background-color: blue;
    border-radius: 10px;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  box-sizing: border-box;
  background-color: white;
  border-radius: 20px;
  width: 300px;
  

    div{
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
    input {
      display: none;
    }
    img{
        cursor: pointer;
    }
    
  }
`;


const Top=styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-between;

    h4{
        margin: 0px;
        padding: 0px;
        
    }
    img{
        cursor: pointer;
    }

    
`;


const Update = ({ setO }) => {
  const [img, setImg] = useState(undefined);
  const [banner, setBanner] = useState(undefined);
  const [inputs, setInputs] = useState({});
  const [imgPerc, setImgPerc] = useState(0);
  const [bannerPerc, setBannerPerc] = useState(0);
  const {currentUser}=useSelector((state)=>state.user);
  const [open, setOpen] = useState(0);
  const [alert, setAlert] = useState("");

  const dispatch = useDispatch();

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
        urlType === "img"
          ? setImgPerc(Math.round(progress))
          : setBannerPerc(Math.round(progress));
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
      const res = await axios.put(`/users/${currentUser._id}`, { ...inputs },{headers:{Authorization:"Bearer "+currentUser.jwt}});
      if(img){
        dispatch(imgUrl(res.data.img));
      }
      if(banner){
        dispatch(bannerUrl(res.data.banner));
      }
      setImgPerc(0);
      setBannerPerc(0);
      handleAlert({ message: "Changes Saved" });
    } catch (err) {
      handleAlert(err);
    }
  };

  useEffect(() => {
    banner && uploadFile(banner, "banner");
  }, [banner]);

  useEffect(() => {
    img && uploadFile(img, "img");
  }, [img]);

  return (
    <Container>
        {open === 1? <Alert/>:""}
      <Wrapper>
        <Top>
            <h4>Update</h4>
            <img style={{width:"30px",height:"30px"}} src="/images/Close.svg" alt="" onClick={()=>setO(0)}/>
        </Top>
        <div>
          <input
            type="file"
            accept="image/*"
            id="image"
            onChange={(e) => setImg(e.target.files[0])}
          />
          <label htmlFor="image">
            <h5>User Image:{imgPerc>0 ? imgPerc+"%":"" }</h5>
            <img src="/images/UpdateImg.svg" alt="" style={{width:"60px",height:"60px"}}/>
           
          </label>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            id="image1"
            onChange={(e) => setBanner(e.target.files[0])}
          />
          <label htmlFor="image1">
            <h5>Banner Image:{bannerPerc>0 ? bannerPerc+"%":"" }</h5>
          <img src="/images/UpdateImg.svg" alt="" style={{width:"60px",height:"60px"}}/>
          </label>
        </div>
        <button onClick={handlePost}>Update</button>
      </Wrapper>
    </Container>
  );
};

export default Update;
