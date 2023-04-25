import React from "react";
import styled from "styled-components";
import Feed from "../components/Feed";
import LeftSide from "../components/LeftSide";
import Navbar from "../components/Navbar";
import RightSide from "../components/RightSide";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  background-color: whitesmoke;
  min-height: 100vh;
  z-index: 99;
  flex-wrap: wrap;
  animation: fadein 0.3s;
  @media (max-width: 468px) {
    padding: 5px;
  }
`;
const Home = () => {
  return (
    <Container>
      <Navbar />
      <LeftSide />
      <Feed />
      <RightSide />
    </Container>
  );
};

export default Home;
