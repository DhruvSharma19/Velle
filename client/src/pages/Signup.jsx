import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, provider } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { signInWithPopup } from "firebase/auth";
import { loginSuccess } from "../redux/userSlice";
import axios from "axios";
import { useNavigate } from "react-router";
import Alert from "../components/Alert";
import { useCookies } from "react-cookie";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  animation: fadein 0.3s;

  img {
    position: absolute;
    right: 0px;
    left: 0px;
    top: 0px;
    bottom: 0px;
    z-index: -1;
    height: 100vh;
    width: 100vw;
  }
`;

const Box = styled.div`
  position: absolute;
  right: 200px;
  top: 100px;

  width: 40vw;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 30px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    top: 100px;
    right: 20vw;
    left: 10vw;
    width: 80vw;
  }

  input {
    padding: 20px;
    font-size: 20px;
    background-color: white;
    border-radius: 20px;
    border: none;
    outline: blue;
    text-align: center;
    width: 100%;

    font-weight: bold;
    transition: all 0.3s ease;
    animation: fadein 1s;

    :hover {
      box-shadow: -11px 10px 0px 1px rgba(0, 0, 0, 1);
      transform: scale(1.1);
    }
  }

  button {
    padding: 20px;
    font-size: 20px;
    font-weight: bold;
    color: white;
    border-radius: 20px;
    outline: none;
    background-color: blue;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;

    :hover {
      box-shadow: -11px 10px 0px 1px whitesmoke;
      transform: scale(1.1);
    }
  }

  div {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;

    p {
      color: white;
      font-size: 15px;
    }
  }
`;

const Line = styled.div`
  background-color: white;
  height: 3px;
  width: 31%;
  margin: 0px 20px 0px 20px;
`;

const Bottom = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  div {
    position: relative;
    background-color: white;
    height: 80px;
    width: 100px;
    border-radius: 20px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px lightgray;
    transition: all 0.3s ease;
    font-weight: bold;

    :hover {
      box-shadow: -11px 10px 0px 1px rgba(0, 0, 0, 1);
      transform: scale(1.1);
    }

    @media (max-width: 768px) {
      width: 60px;
      height: 60px;
    }
  }

  img {
    position: relative;
    height: 50px;
    width: 50px;
    border-radius: 10px;
    cursor: pointer;
    z-index: 2;
  }
`;

const Signup = () => {
  const name = useSelector((state) => state.user.name);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [input, setInput] = useState("");
  const [sign, setSign] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(0);
  const [alert, setAlert] = useState("");

  const handleAlert = (err) => {
    setAlert(err);
    setOpen(1);
    setTimeout(() => {
      setOpen(0);
    }, 2000);
  };

  

  const handleSignin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/signin", { email, password });
      dispatch(loginSuccess({...res.data.others,jwt:res.data.jwt}));
      navigate("/home");
    } catch (err) {
      handleAlert("error");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/auth/signup`, {
        name: input,
        email: email,
        password: password,
      });
      dispatch(loginSuccess({...res.data.others,jwt:res.data.jwt}));
      navigate("/home");
    } catch (err) {
      handleAlert("error");
    }
  };

  const handleGoogle = async (e) => {
    e.preventDefault();

    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          axios
            .post("/auth/google", {
              name: result.user.displayName,
              email: result.user.email,
              img: result.user.photoURL,
            })
            .then((res) => {
              dispatch(loginSuccess({...res.data.others,jwt:res.data.jwt}));
              navigate("/home");
            });
        })
        .catch((err) => {
          handleAlert("error");
        });
    } catch (err) {
      handleAlert("error");
    }
  };
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          loginSuccess({
            name: user.displayName,
            email: user.email,
            img: user.photoURL,
          })
        );
        navigate("/home");
      }
    });
  }, [name]);

  return (
    <Container>
      {open && <Alert desc={alert} />}
      <img src="/images/Background.svg" alt="yes" />
      <Box>
        {sign === 0 ? (
          <></>
        ) : (
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your Name"
          />
        )}
        <input
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Enter email or phone number"
        />
        <input
          type="text"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
        />
        {sign === 1 ? (
          <button onClick={handleSignUp}>Sign Up</button>
        ) : (
          <button onClick={handleSignin}>Sign in</button>
        )}

        <div>
          <Line></Line>
          <p>or continue with</p>
          <Line></Line>
        </div>

        <Bottom>
          <div onClick={handleGoogle}>
            <img src="/images/Google.svg" alt="" />
          </div>
          <div>
            <img src="/images/Apple.svg" alt="" />
          </div>
          {sign === 0 ? (
            <div onClick={() => setSign(1)}>Sign Up</div>
          ) : (
            <div onClick={() => setSign(0)}>Sign In</div>
          )}
        </Bottom>
      </Box>
    </Container>
  );
};

export default Signup;
