import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import RightCard from "./RightCard";

const Container = styled.div`
  margin-top: 60px;
  flex: 1.5;
  gap: 10px;
  background-color: whitesmoke;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  animation: fadein 0.3s;
  @media (max-width: 768px) {
    padding-bottom: 60px;
  }
`;

const Box = styled.div`
  border-radius: 15px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 50vh;
  overflow-y: scroll;
  gap: 20px;
  box-sizing: border-box;
  width: 100%;
  padding: 15px;
  max-height: 50vh;
  font-weight: bold;

  ::-webkit-scrollbar {
    width: 5px;
  }
  & > div {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border-bottom: 2px solid lightgray;

    & > h3 {
      color: black;
    }
  }
`;

const RightSide = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Container>
      <Box>
        <div>
          <h3>Friend Requests</h3>
        </div>

        {currentUser?.requests.length === 0 ? "Nothing To Show" : ""}
        {currentUser?.requests?.map((u) => {
          return <RightCard key={u} u={u} />;
        })}
      </Box>
    </Container>
  );
};

export default RightSide;
