import React, { useEffect, useState } from "react";
import styled from "styled-components";
import LeftSide from "../components/LeftSide";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router";
import axios from "axios";
import Card from "../components/Card";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  background-color: whitesmoke;
  flex-wrap: wrap;
  animation: fadein 0.3s;

  @media (max-width: 1000px) {
    flex-wrap: wrap;
  }
`;

const Main = styled.div`
  flex: 8;
  min-width: 60vw;
  display: grid;
  box-sizing: border-box;
  padding: 20px;
  margin-top: 70px;
  background-color: whitesmoke;
  height: calc(100vh - 70px);
  overflow-y: scroll;
  grid-template-columns: repeat(3, minmax(20vw, 3fr));
  grid-template-rows: repeat(3, minmax(300px, 3fr));
  gap: 20px;
  padding-bottom: 60px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(1, minmax(20vw, 3fr));
    grid-template-rows: repeat(2, minmax(200px, 3fr));
  }

  ::-webkit-scrollbar {
    width: 5px;
  }
`;

const Nothing = styled.div`
  width: 100%;
  font-size: 35px;
  color: black;
  text-align: center;
  font-weight: bold;
`;

const Search = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const query = useLocation().search;

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(
        `https://velle-wtov.onrender.com/api/users/search${query}`,
        { headers: { Authorization: "Bearer " + currentUser.jwt } }
      );
      setUsers(res.data);
    };
    fetchVideos();
  }, [query]);

  return (
    <>
      <Navbar />
      <Container>
        <LeftSide />
        <Main>
          {users.length === 0 ? <Nothing>No result Match</Nothing> : ""}
          {users.map((user) =>
            user._id === currentUser._id ? (
              <></>
            ) : (
              <Card key={user._id} user={user} />
            )
          )}
        </Main>
      </Container>
    </>
  );
};

export default Search;
