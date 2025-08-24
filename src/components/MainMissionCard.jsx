// 일일미션 카드
import styled from "styled-components";
import AIRecommendText from "../assets/images/ai_recommend_text.svg?react"; // "AI추천" 텍스트 이미지화
import AIRecommendEmoji from "../assets/logos/ai_recommend.svg?react"; // AI추천 카드 내 이모지
import MissionThumbIcon from "../assets/logos/missionlist.svg?react"; // 일반 카드 내 이모지

export default function MainMissionCard({
  onClick,
  data,
  recommended // true면 AI 추천 카드(UI 빨간 테두리 + 배지 + 이모지)
}) {
  return (
    <Card $recommended={recommended} onClick={onClick}>
      {/* 추천 배지(이미지) */}
      {recommended && (
        <BadgeWrap>
          <AIRecommendText />
        </BadgeWrap>
      )}

      <Row>
        <TextCol>
          <StoreText>{data.storeName}</StoreText>
          <TitleText>{data.title}</TitleText>
          <RewardText>보상: {data.reward}</RewardText>
        </TextCol>

        {/* 오른쪽 썸네일: 추천이면 AI 이모지, 아니면 기본 썸네일 */}
        <Thumb $recommended={recommended}>
          {recommended ? <AIRecommendEmoji /> : <MissionThumbIcon />}
        </Thumb>
      </Row>
    </Card>
  );
}

/* ===== styles ===== */
const Card = styled.button`
  all: unset;
  box-sizing: border-box;
  width: 100%; /* ✅ 부모폭 가득 */
  border-radius: 12px;
  cursor: pointer;

   /* 포커스(클릭) 아웃라인 제거 */
  outline: none;
  -webkit-tap-highlight-color: transparent;
  &:focus,
  &:focus-visible,
  &:active {
    outline: none;
    box-shadow: none;
  }


  /* 공통 배경/여백 */
  background: ${({ $recommended }) => ($recommended ? "#fff" : "#FFEDD6")};
  padding: 16px;

  /* 추천카드: 빨간 테두리 + 살짝 그림자 */
  border: ${({ $recommended }) =>
    $recommended ? "2px solid #F25C3D" : "2px solid transparent"};
  box-shadow: ${({ $recommended }) =>
    $recommended ? "0 6px 18px rgba(242,92,61,0.15)" : "none"};

  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
`;

const BadgeWrap = styled.div`
  width: fit-content;
  margin-top: -2px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TextCol = styled.div`
  flex: 1;
  min-width: 0;
`;

const StoreText = styled.div`
  color: #7a7a7a;
  font-size: 12px;
  line-height: 18px;
  margin-bottom: 4px;
`;

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
  line-height: 18px;
`;

const Thumb = styled.div`
  position: relative;
  flex: 0 0 76px;
  width: 76px;
  height: 76px;
  border-radius: 14px;
  background: ${({ $recommended }) => ($recommended ? "#FFF4F0" : "#FBE7DA")};
  display: grid;
  place-items: center;

  svg {
    width: 110px;
    height: 110px;
    transform: translate(-28px, -20px); /* ← 왼쪽(-x), 위(-y)로 살짝 이동 */
  }
`;

const Check = styled.div`
  position: absolute;
  right: -6px;
  bottom: -6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #5bc0eb;
  color: #fff;
  font-weight: 900;
  font-size: 14px;
  display: grid;
  place-items: center;
  border: 2px solid #fff;
`;