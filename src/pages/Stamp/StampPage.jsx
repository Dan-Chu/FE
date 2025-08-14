// src/pages/Stamp/Stamp.jsx
import { useState } from "react";
import styled from "styled-components";

import TitleBar from "../../components/TitleBar";
import Navar from "../../components/Navar";
import MainStampCard from "../../components/MainStampCard";
import { StampCodeModal, RewardCodeModal } from "../../components/Modal";
import { StampCircleButton } from "../../components/Button";

export default function StampPage() {
  const [stores, setStores] = useState([
    { storeName: "동방손칼국수", stamps: 3,  cyclesCompleted: 0, hasUnclaimedReward: false },
    { storeName: "카페단추",     stamps: 10, cyclesCompleted: 1, hasUnclaimedReward: true  },
    { storeName: "분식단추",     stamps: 0,  cyclesCompleted: 0, hasUnclaimedReward: false },
  ]);

  const [modalType, setModalType] = useState(null); // 'stamp' | 'claim'
  const [activeIdx, setActiveIdx] = useState(null);

  /* 상단 전역 도장 버튼: 항상 활성화 */
  const openGlobalStamp = () => setModalType("stamp");

  const openClaim = (idx) => {
    setActiveIdx(idx);
    setModalType("claim");
  };

  // ===== 서버 연동 자리 =====
  const handleSubmitStamp = async (code) => {
    // TODO: const { storeId } = await api.verifyStamp({ code });
    setStores((prev) => {
      const idx = prev.findIndex((s) => s.stamps < 10);
      const safeIdx = Math.max(0, idx);
      const next = [...prev];
      const s = { ...next[safeIdx] };
      if (s.stamps >= 9) {
        s.stamps = 10; s.hasUnclaimedReward = true;
      } else {
        s.stamps += 1;
      }
      next[safeIdx] = s;
      return next;
    });
    setModalType(null);
    setActiveIdx(null);
  };

  const handleSubmitClaim = async (code) => {
    // TODO: await api.claimReward(stores[activeIdx].storeName, { code });
    setStores((prev) => {
      const next = [...prev];
      const s = { ...next[activeIdx] };
      s.hasUnclaimedReward = false;
      s.stamps = 0;
      s.cyclesCompleted = (s.cyclesCompleted || 0) + 1;
      next[activeIdx] = s;
      return next;
    });
    setModalType(null);
    setActiveIdx(null);
  };

  const closeModal = () => { setModalType(null); setActiveIdx(null); };

  return (
    <Page>
      {/* 상단 sticky 헤더 */}
      <Header>
        <HeaderInner>
          <TitleBar pageName="스탬프" />
          <TopRight>
            <StampCircleButton size={28} onClick={openGlobalStamp} />
          </TopRight>
        </HeaderInner>
      </Header>

      {/* 본문 스크롤 영역 */}
      <ScrollArea>
        <List>
          {stores.map((store, idx) => (
            <MainStampCard
              key={store.storeName + idx}
              store={store}
              onClaim={() => openClaim(idx)}
            />
          ))}
        </List>
      </ScrollArea>

      {/* 하단 고정 네비 */}
      <Navar />

      {/* 모달들 */}
      {modalType === "stamp" && (
        <StampCodeModal
          storeName=""
          onClose={closeModal}
          onSubmit={handleSubmitStamp}
        />
      )}
      {modalType === "claim" && activeIdx != null && (
        <RewardCodeModal
          storeName={stores[activeIdx].storeName}
          onClose={closeModal}
          onSubmit={handleSubmitClaim}
        />
      )}
    </Page>
  );
}

/* ===== styles ===== */

/* 화면 꽉 채우는 루트 */
const Page = styled.div`
  position: fixed;   /* 뷰포트 전체 차지 */
  inset: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;  /* 바깥 스크롤 방지 */
`;

/* 상단 고정 헤더 */
const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
  /* 데모용 경계선: 필요 없으면 지워도 됨 */
  box-shadow: 0 1px 0 rgba(0,0,0,0.06);
`;
const HeaderInner = styled.div`
  position: relative;
  padding: 16px 16px 8px;
`;
const TopRight = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
`;

/* 본문 스크롤 영역 (여기가 포인트: min-height:0) */
const ScrollArea = styled.div`
  flex: 1 1 auto;
  min-height: 0;                 /* ✅ 없으면 0px로 붕괴할 수 있음 */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 16px calc(90px + env(safe-area-inset-bottom));
  background: #fff;
`;

/* 카드 리스트 */
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 8px;
`;
