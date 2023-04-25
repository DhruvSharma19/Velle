import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Comment from "./Comment";
import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, like } from "../redux/postSlice";
import Alert from "./Alert";

const Container = styled.div`
  background-color: white;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  border-radius: 20px;
  padding: 20px;

  width: 100%;
  animation: fadein 0.3s;
`;

const Top = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Left = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;

  div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;

    img {
      height: 50px;
      width: 50px;
      cursor: pointer;
      border-radius: 50%;
    }

    span {
      color: gray;
      font-weight: bold;
    }
    div {
      color: black;
      font-weight: bold;
    }
  }
`;

const Dropdown = styled.span`
  position: absolute;
  top: 48px;
  right: 0px;
  color: white;
  background-color: rgb(19, 19, 19);
  border: 1px solid rgba(151, 151, 151, 0.34);
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 50%) 0px 0px 18px 0px;
  padding: 10px;
  font-size: 14px;
  letter-spacing: 3px;
  width: 100px;
  opacity: 0;
  cursor: pointer;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    ${Dropdown} {
      opacity: 1;
      transition-duration: 1s;
    }
  }

  div {
    height: 50px;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    :hover {
      background-color: lightgray;
    }

    img {
      height: 40px;
      width: 40px;
      border-radius: 50%;
    }
  }
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
  overflow: hidden;

  div {
    width: 100%;
    color: gray;
    font-size: 20px;
    letter-spacing: 1px;
    line-height: 30px;
  }

  img {
    width: 100%;
    border-radius: 10px;
  }

  video {
    width: 100%;
    border-radius: 10px;
  }
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Reaction = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;

    img {
      height: 35px;
      width: 35px;
      border-radius: 50%;
      cursor: pointer;
    }
    span {
      color: black;
      font-weight: bold;
    }
  }
`;

const Share = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;

  img {
    height: 35px;
    width: 35px;
    cursor: pointer;
  }

  span {
    color: black;
    font-weight: bold;
  }
`;

const Post = ({ post }) => {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [c, setC] = useState(0);
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


  const handlePost = async () => {
    try {
      await axios.delete(`/post/${post._id}`);
      dispatch(deletePost(post._id));
    } catch (err) {
      handleAlert("error");
    }
  };

  const handleLike = async () => {
    try {
      await axios.put(`/post/like/${post._id}`);
      dispatch(like({ postId: post._id, userId: currentUser._id }));
    } catch (err) {
      handleAlert("error");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/find/${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId, dispatch]);

  return (
    <Container>
        {open === 1 ? <Alert desc={alert} /> : <></>}
      <Top>
        <Left>
          <div>
            <Link to={`/profile/${post.userId}`}>
              <img src={user.img || "/images/profile.svg"} alt="" />
            </Link>
          </div>
          <div>
            <div>{user.name}</div>
            <span>{format(post.createdAt)}</span>
          </div>
        </Left>
        <Right>
          <div>
            <img src="/images/More.svg" alt="" />
          </div>
          {post.userId === currentUser._id ? (
            <Dropdown>
              <span onClick={handlePost}>Delete</span>
            </Dropdown>
          ) : (
            ""
          )}
        </Right>
      </Top>
      <Center>
        <div>{post.desc}</div>
        {post.imgUrl ? <img src={post.imgUrl} alt="" /> : ""}
        {post.videoUrl ? (
          <video src={post.videoUrl} controls autoPlay muted></video>
        ) : (
          ""
        )}
      </Center>
      <Bottom>
        <Reaction>
          <div>
            <img
              src="/images/ThumbUp.svg"
              alt=""
              style={{ backgroundColor: "blue" }}
              onClick={handleLike}
            />
            <img
              src="/images/Heart.svg"
              alt=""
              style={{ backgroundColor: "red" }}
            />
            <span>{post.likes.length} Like</span>
          </div>
          <div>
            <img src="/images/Comment.svg" alt="" />
            <span>{c} Comments</span>
          </div>
        </Reaction>
        <Share>
          <img src="/images/Share.svg" alt="" />
          <span>Share</span>
        </Share>
      </Bottom>
      <Comment post={post} c={c} setC={setC} />
    </Container>
  );
};

export default Post;
