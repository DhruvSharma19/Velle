import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NewPost from "./NewPost";
import Post from "./Post";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { postSuccess } from "../redux/postSlice";
import Alert from "./Alert";

const Container = styled.div`
  margin-top: 60px;
  flex: 3;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  animation: fadein 0.3s;
`;

const Feed = () => {
  const currentpost = useSelector((state) => state.post.currentPost);
  const { currentUser } = useSelector((state) => state.user);
  const [open, setOpen] = useState(0);
  const [alert, setAlert] = useState("");
  const dispatch = useDispatch();

  const handleAlert = (err) => {
    setAlert(err);
    setOpen(1);
    setTimeout(() => {
      setOpen(0);
    }, 2000);
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          `https://velle-wtov.onrender.com/api/post/random`
        );
        dispatch(postSuccess(res.data));
      } catch (err) {
        handleAlert("error");
      }
    };
    fetchVideos();
  }, [dispatch]);

  return (
    <Container>
      {open === 1 ? <Alert desc={alert} /> : <></>}
      <NewPost />

      {currentpost?.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </Container>
  );
};

export default Feed;
