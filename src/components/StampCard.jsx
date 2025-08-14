import styled from "styled-components";
import Stamp from "../assets/icons/stamp.svg?react";

export default function StampCard() {
  const TotalStamp = 10;
  const stampCount = 7;

  return (
    <Card>
      <StampName>국수가락</StampName>
      <StampGroup>
        {Array.from({ length: TotalStamp }).map((_, i) => (
          <StampBox key={i}>{i < stampCount ? <Stamp /> : <></>}</StampBox>
        ))}
      </StampGroup>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 315px;
  height: 183px;
  flex-shrink: 0;
  border-radius: 12px;
  border: 1px solid #d9d9d9;
  background: #fff;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 10px;
  gap: 10px;
`;
const StampGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
`;
const StampName = styled.div`
  color: #ce4927;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 30px; /* 187.5% */
  letter-spacing: -1px;
  height: 30px;
`;
const StampBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 55px;
  height: 55px;
  flex-shrink: 0;
  border-radius: 14px;
  background: #f9e9e7;
`;

