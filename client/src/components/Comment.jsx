import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Reply from "./Reply";
import axios from "axios";
import { useSelector } from "react-redux";
import Alert from "./Alert";

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-direction: column;
  animation: fadein 0.3s;
`;

const Main = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 8px;
  gap: 8px;
  height: calc(100% - 70px);
  border-radius: 20px;
  background-color: whitesmoke;
  max-height: 200px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 5px;
  }
`;

const Input = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  textarea {
    width: calc(100% - 50px);
    resize: none;
    padding: 8px;
    border-radius: 20px;
    border: 1px solid gray;
    outline: none;
    font-size: 15px;
    font-weight: bold;
  }

  div {
    border-radius: 50%;
    background-color: blue;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 5px;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
`;

const Comment = ({ post, c, setC }) => {
  const{currentUser}=useSelector((state)=>state.user);
  const [value, setValue] = useState("");
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(0);
  const [alert, setAlert] = useState("");

  const handleAlert = (err) => {
    setAlert(err);
    setOpen(1);
    setTimeout(() => {
      setOpen(0);
    }, 2000);
  };


  const handleComment = async () => {
    try {
      const res = await axios.post(`https://velle-wtov.onrender.com/api/comment/create`, {
        postId: post._id,
        desc: value,
      },{headers:{Authorization:"Bearer "+currentUser.jwt}});
      setComments([...comments, res.data]);
      setC(c + 1);
      setValue("");
    } catch (err) {
      handleAlert("error");
    }
  };

  // const deleteComment = async (c) => {
  //   try {
  //     await axios.delete(`/comment/delete/${c._id}`);
  //     comments.splice(
  //       comments.findIndex((comment) => comment._id === c.id),
  //       1
  //     );
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`https://velle-wtov.onrender.com/api/comment/getAll/${post._id}`);
      setComments(res.data);
      setC(comments.length);
    } catch (err) {
      handleAlert("error");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post]);

  return (
    <Container>
      {open === 1 ? <Alert desc={alert} /> : <></>}
      {comments.length === 0 ? (
        ""
      ) : (
        <Main>
          {comments.map((c) => {
            return <Reply key={c._id} c={c} />;
          })}
        </Main>
      )}
      <Input>
        <textarea
          name="comment"
          id=""
          rows="1"
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your comment"
          value={value}
        ></textarea>
        <div>
          <img src="/images/Send1.svg" alt="" onClick={handleComment} />
        </div>
      </Input>
    </Container>
  );
};

export default Comment;
