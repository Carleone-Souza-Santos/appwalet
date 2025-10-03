"use client";

import React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
`;

const Loader = styled.div`
  border: 8px solid #f3f3f3;
  border-top: 8px solid #003650;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 1s linear infinite;
  margin: 100px auto;
`;

export default function CircularLoader() {
  return <Loader />;
}
