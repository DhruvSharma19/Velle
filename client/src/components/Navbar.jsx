import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { logout } from "../redux/userSlice";
import { auth } from "../firebase";
import Alert from "./Alert";

const Container = styled.div`
  position: fixed;
  top: 0px;
  width: 100vw;
  height: 60px;
  z-index: 100;
  background-color: white;

  display: flex;
  flex-direction: row;
  align-items: center;
  animation: fadein 0.3s;

  gap: 20px;
  padding: 0px 20px;
  box-sizing: border-box;
  box-shadow: 0px 3px 5px 0px rgba(176, 176, 176, 1);
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;

  img {
    height: 50px;
    width: 50px;
    cursor: pointer;
  }

  p {
    color: blue;
    font-weight: bold;
    font-size: 40px;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    cursor: pointer;
  }

  @media (max-width: 1200px) {
    display: none;
  }
`;

const Center = styled.div`
  flex: 3;
  display: flex;
  flex-direction: row;
  gap: 25px;
  align-items: center;
`;

const Search = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
  border-radius: 20px;
  border: none;
  background-color: whitesmoke;
  flex: 1;

  img {
    height: 100%;
    width: 10%;
    border-radius: 20px 0px 0px 20px;
    cursor: pointer;
  }
  input {
    height: 100%;
    width: 90%;
    border: none;
    outline: none;
    border-radius: 0px 20px 20px 0px;
    background-color: whitesmoke;
    color: black;
    font-size: 20px;
    letter-spacing: 1px;

    ::placeholder {
      color: gray;
      font-size: 15px;
    }
  }
`;

const Icons = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  background-color: white;

  @media (max-width: 768px) {
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }

  div {
    height: 50px;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: whitesmoke;
    border-radius: 50%;
    cursor: pointer;

    :hover {
      background-color: powderblue;
    }

    img {
      height: 40px;
      width: 40px;

      :hover {
        fill: blue;
      }
    }
  }
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;

  justify-content: center;
`;

const Icon = styled.div`
  div {
    border-radius: 50%;
    height: 50px;
    width: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    :hover {
      background-color: lightgray;
    }

    img {
      height: 40px;
      width: 40px;
      color: blue;
    }
  }
  @media (max-width: 1200px) {
    display: none;
  }
`;

const User = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const Dropdown = styled.div`
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
`;

const Signout = styled.div`
  position: relative;
  height: 48px;
  width: 48px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  &:hover {
    ${Dropdown} {
      opacity: 1;
      transition-duration: 1s;
    }
  }
`;

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(0);
  const [alert, setAlert] = useState("");

  const handleAlert = (err) => {
    setAlert(err);
    setOpen(1);
    setTimeout(() => {
      setOpen(0);
    }, 2000);
  };

  const handleAuth = async () => {
    try {
      if (currentUser.fromGoogle) {
        signOut(auth)
          .then(() => {
            dispatch(logout());
            navigate("/");
          })
          .catch((error) => {
            handleAlert("error");
          });
      } else {
        dispatch(logout());
        navigate("/");
      }
    } catch (err) {
      handleAlert("error");
    }
  };

  return (
    <Container>
      {open === 1 ? <Alert desc={alert} /> : <></>}
      <Left>
        <Link to="/home">
          <img src="/images/Velle.svg" alt="" />
        </Link>
        <p>Velle</p>
      </Left>
      <Center>
        <Search>
          <img
            src="/images/Search.svg"
            alt=""
            onClick={() => navigate(`/search?q=${q}`)}
          />
          <input
            type="text"
            placeholder="Start typing to search"
            onChange={(e) => setQ(e.target.value)}
          />
        </Search>
        <Icons>
          <Link to="/home">
            <div>
              <img src="/images/Home.svg" alt="" />
            </div>
          </Link>
          <Link to={`/messenger/${currentUser._id}`}>
            <div>
              <img src="/images/Message.svg" alt="" />
            </div>
          </Link>
          <Link to={`/messenger/${currentUser._id}`}>
            <div>
              <img src="/images/Video.svg" alt="" />
            </div>
          </Link>
          <Link to={`/friend/${currentUser._id}`}>
            <div>
              <img src="/images/Person.svg" alt="" />
            </div>
          </Link>
        </Icons>
      </Center>
      <Right>
        <Icon>
          <div>
            <img src="/images/Bell.svg" alt="" />
          </div>
        </Icon>
        <Icon>
          <div>
            <img src="/images/Notification.svg" alt="" />
          </div>
        </Icon>
        <Icon>
          <div>
            <img src="/images/Setting.svg" alt="" />
          </div>
        </Icon>
        <Signout>
          <User>
            <div>
              <img src={currentUser.img || "/images/profile.svg"} alt="" />
            </div>
          </User>
          <Dropdown>
            <span onClick={handleAuth}>Sign out</span>
          </Dropdown>
        </Signout>
      </Right>
    </Container>
  );
};

export default Navbar;
