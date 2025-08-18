import styled from "styled-components";
import Stamp from "../assets/icons/stamp.svg?react";

export default function StampCard(data) {
  const TotalStamp = 10;
  const stampCount = data.currentCount;

  return (
    <Card>
      <StampName>{data.storeName}</StampName>
      <StampGroup>
        {Array.from({ length: TotalStamp }).map((_, i) => (
          <StampBox key={i}>{i < stampCount ? <Stamp /> : null}</StampBox>
        ))}
      </StampGroup>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  align-self: center;

  /* ✅ 가운데 정렬 + 반응형 폭 */
  width: 100%;
  max-width: 315px;
  margin: 0 auto;

  height: 183px;
  flex-shrink: 0;
  border-radius: 12px;
  border: 1px solid #d9d9d9;
  background: #fff;
  padding: 10px 15px;
  gap: 10px;
  box-sizing: border-box;
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
  font-weight: 700;
  line-height: 30px;
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

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 8px;
  align-items: center; /* ✅ 자식(카드) 가로 중앙 */
`;
