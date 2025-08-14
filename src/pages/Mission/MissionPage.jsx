// 일일미션
import { useState } from "react";
import styled from "styled-components";
import Navar from "../../components/Navar";
import TitleBar from "../../components/TitleBar";
import MainMissionCard from "../../components/MainMissionCard";
import { MissionModal, CodeInputModal, CouponSuccessModal } from "../../components/Modal";

export default function MissionPage() {
  const [isMissionOpen, setIsMissionOpen] = useState(false);
  const [isCodeInputOpen, setIsCodeInputOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  return (
    <Wrapper>
      <TitleBar pageName="일일미션" />

      <MissionInfo>
        <BoldText>김단추</BoldText>님의 완료한 미션 <RedText>NN</RedText>개
      </MissionInfo>

      {/* AI 추천 카드 (빨간 카드) */}
      <Section>
        <MainMissionCard
          recommended
          store="가게이름"
          title="미션내용내용내용"
          reward="탄산 음료 한 캔 쿠폰"
          onClick={() => setIsMissionOpen(true)}
        />
      </Section>

      {/* 일반 카드 리스트 (버튼 없음, 카드 전체 클릭) */}
      <CardList>
        <MainMissionCard
          store="가게이름"
          title="미션내용내용내용"
          reward="탄산 음료 한 캔 쿠폰"
          onClick={() => setIsMissionOpen(true)}
        />
        <MainMissionCard
          store="가게이름"
          title="미션내용내용내용"
          reward="탄산 음료 한 캔 쿠폰"
          onClick={() => setIsMissionOpen(true)}
        />
        <MainMissionCard
          store="가게이름"
          title="미션내용내용내용"
          reward="탄산 음료 한 캔 쿠폰"
          onClick={() => setIsMissionOpen(true)}
        />
      </CardList>

      {/* 모달 로직 기존 그대로 */}
      {isMissionOpen && (
        <MissionModal
          mission={{
            image: "https://via.placeholder.com/126",
            title: "15,000원 이상 결제하기",
            store: "동방손칼국수",
            reward: "찐만두",
          }}
          onClose={() => setIsMissionOpen(false)}
          onSubmit={() => {
            setIsMissionOpen(false);
            setIsCodeInputOpen(true);
          }}
        />
      )}

      {isCodeInputOpen && (
        <CodeInputModal
          onClose={() => setIsCodeInputOpen(false)}
          onSubmit={() => {
            setIsCodeInputOpen(false);
            setIsSuccessOpen(true);
          }}
        />
      )}

      {isSuccessOpen && <CouponSuccessModal onClose={() => setIsSuccessOpen(false)} />}

      <Navar />
    </Wrapper>
  );
}

/* ===== styles ===== */
const Wrapper = styled.div`
  position: fixed;     /* ✅ 부모 제약 무시하고 뷰포트에 고정 */
  inset: 0;            /* top:0; right:0; bottom:0; left:0; */
  overflow-y: auto;    /* 스크롤은 여기서 */
  background: #fff;

  /* 안쪽 여백 (좌우/상하) */
  padding: 24px 16px;

  /* 바텀 네비가 fixed라 가리지 않게 여백 추가 */
  padding-bottom: calc(90px + env(safe-area-inset-bottom));
`;

const MissionInfo = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  line-height: 30px;
  margin: 12px 0 16px;
`;

const BoldText = styled.span`
  color: #ce4927;
  font-weight: 700;
`;

const RedText = styled.span`
  color: #d94a38;
  font-weight: 700;
`;

const Section = styled.div`
  margin-bottom: 14px;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
