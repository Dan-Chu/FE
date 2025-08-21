import styled from "styled-components";
import LoadingAnimation from "../assets/images/loading.svg?react";

export default function Loading() {
  return (
    <LoadingBox>
      잠시만 기다려주세요.
      <LoadingAnimation width="105px" height="105px"/>
    </LoadingBox>
  );
}

const LoadingBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
  flex-direction: column;
  margin-top: 100px;

  color: #464646;
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 30px; /* 150% */
  letter-spacing: -1px;
`;
