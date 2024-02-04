import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FriendCard from "../components/FriendCard";
import LeftSide from "../components/LeftSide";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation } from "react-router";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  background-color: whitesmoke;
  min-height: 100vh;
  z-index: 99;
  flex-wrap: wrap;
  animation: fadein 0.3s;
`;

const Main = styled.div`
  box-sizing: border-box;
  background-color: whitesmoke;
  flex: 4.5;
  margin-top: 70px;
  min-width: 60vw;
  box-sizing: border-box;
  padding: 20px;
  overflow-y: scroll;
  height: calc(100vh - 70px);
  color: white;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 30px;
  padding-bottom: 60px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }
`;

const Nothing = styled.div`
  width: 100%;
  font-size: 35px;
  color: black;
  text-align: center;
  font-weight: bold;
`;

const Friend = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      <Navbar />
      <Container>
        <LeftSide />
        <Main>
          {currentUser.friends.length === 0 ? (
            <Nothing>Nothing To Show</Nothing>
          ) : (
            ""
          )}
          {currentUser.friends?.map((friend) => {
            return <FriendCard key={friend} friend={friend} />;
          })}
        </Main>
      </Container>
    </>
  );
};

export default Friend;
