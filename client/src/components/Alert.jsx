import React from "react";
import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  top: 60px;
  left: 0px;
  right: 0px;
  height: 40px;
  background-color: blue;
  color: white;
  font-size: 28px;
  color: white;
  font-weight: bold;
  text-align: center;
  letter-spacing: 1px;
  z-index: 2000;
  align-items: center;
  display: flex;
  justify-content: center;
  animation: fadein 0.3s;
`;

const Alert = (props) => {
  return (
    <Container props={props}>
      {props.desc == "error" ? "Something went wrong" : props.desc}
    </Container>
  );
};

export default Alert;
