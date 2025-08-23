// src/components/MainMissionCard.jsx
import styled from "styled-components";
import AIRecommendText from "../assets/images/ai_recommend_text.svg?react";
import AIRecommendEmoji from "../assets/logos/ai_recommend.svg?react";
import MissionThumbIcon from "../assets/logos/missionlist.svg?react";

export default function MainMissionCard({ onClick, data, recommended }) {
  return (
    <Card $recommended={recommended} onClick={onClick}>
      {recommended && (
        <BadgeWrap>
          <AIRecommendText />
        </BadgeWrap>
      )}

      <Row>
        <TextCol>
          <StoreText>{data.storeName}</StoreText>
          <TitleText>{data.title}</TitleText>
          <RewardText>보상: {data.rewardName || "상세에서 확인"}</RewardText>
        </TextCol>

        <Thumb $recommended={recommended}>
          {recommended ? <AIRecommendEmoji /> : <MissionThumbIcon />}
        </Thumb>
      </Row>
    </Card>
  );
}

/* ===== styles ===== */
const Card = styled.button`
  all: unset; box-sizing: 
  border-box; width: 100%;
  border-radius: 12px; 
  cursor: pointer;
  outline: none; 
  -webkit-tap-highlight-color: transparent;
  &:focus,&:focus-visible,&:active { outline: none; box-shadow: none; }

  background: ${({ $recommended }) => ($recommended ? "#fff" : "#FFEDD6")};
  padding: 16px;
  border: ${({ $recommended }) => ($recommended ? "2px solid #F25C3D" : "2px solid transparent")};
  box-shadow: ${({ $recommended }) => ($recommended ? "0 6px 18px rgba(242,92,61,0.15)" : "none")};

  display: flex; flex-direction: 
  column; gap: 10px; 
  text-align: left;
`;
const BadgeWrap = styled.div` 
width: fit-content; 
margin-top: -2px; `;

const Row = styled.div` 
display: flex; 
align-items: center; 
gap: 12px; `;

const TextCol = styled.div` 
flex: 1; 
min-width: 0; `;

const StoreText = styled.div` 
color: #7a7a7a; 
font-size: 12px; 
line-height: 18px; 
margin-bottom: 4px; `;

const TitleText = styled.div`
  color: #141414; 
  font-size: 18px; 
  font-weight: 800;
  line-height: 1.25; 
  letter-spacing: -0.5px; 
  word-break: keep-all; 
  margin-bottom: 6px;
`;

const RewardText = styled.div` 
color: #5d5d5d; 
font-size: 13px; 
line-height: 18px; `;

const Thumb = styled.div`
  position: relative; 
  flex: 0 0 76px; 
  width: 76px; 
  height: 76px;
  border-radius: 14px; 
  background: ${({ $recommended }) => ($recommended ? "#FFF4F0" : "#FBE7DA")};
  display: grid; 
  place-items: center;
  svg { width: 110px; height: 110px; transform: translate(-28px, -20px); }
`;
