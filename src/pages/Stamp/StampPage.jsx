import { useEffect, useState } from "react";
import styled from "styled-components";

import TitleBar from "../../components/TitleBar";
import Navar from "../../components/Navar";
import MainStampCard from "../../components/MainStampCard";
import {
  StampCodeModal,
  RewardCodeModal,
  AlreadyExistsModal,
  CouponSuccessModal,
} from "../../components/Modal";
import { StampCircleButton } from "../../components/Button";
import { StampListGet } from "../../shared/api/stamp";

// 임시: 인증코드 → 가게 인덱스 매핑 (API 오면 대체)
const CODE_MAP = {
  "1234": 0, // 동방손칼국수
  "5678": 1, // 카페단추
  "0000": 2, // 분식단추
};

export default function StampPage() {
  const [stores, setStores] = useState([
    { storeName: "동방손칼국수", stamps: 3,  cyclesCompleted: 0, hasUnclaimedReward: false },
    { storeName: "카페단추",     stamps: 10, cyclesCompleted: 1, hasUnclaimedReward: true  },
    { storeName: "분식단추",     stamps: 0,  cyclesCompleted: 0, hasUnclaimedReward: false },
  ]);

  // 'stamp' | 'claim' | 'exists' | 'success' | null
  const [modalType, setModalType] = useState(null);
  const [activeIdx, setActiveIdx] = useState(null);
  const openGlobalStamp = () => setModalType("stamp");
  const openClaim = (idx) => { setActiveIdx(idx); setModalType("claim"); };
  const [stampData,setStampData]=useState();//도장 데이터

  useEffect(()=>{//도장 데이터 가져오기
    const getStamp=async ()=>{
      const result=await StampListGet();
      setStampData(result);
    }

    getStamp();
  },[])

  const handleSubmitStamp = async (data) => {//스탬프 데이터 받기
    const idxByCode = CODE_MAP[code];//여기서 부터 해줘 어떤걸 바꿔야할 지 잘 모르겠어
    const target = stores[idxByCode];//스웨거 보고 data.뭐뭐뭐로 쓰면 될듯

    if (target.hasUnclaimedReward || target.stamps >= 10) {
      setModalType(null);
      setActiveIdx(idxByCode);
      setTimeout(() => setModalType("exists"), 0);
      return;
    }

    setStores((prev) => {
      const next = [...prev];
      const s = { ...next[idxByCode] };
      if (s.stamps >= 9) {
        s.stamps = 10;
        s.hasUnclaimedReward = true;
      } else {
        s.stamps += 1;
      }
      next[idxByCode] = s;
      return next;
    });

    setModalType(null);
    setActiveIdx(null);
  };

  const handleSubmitClaim = async (code) => {
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
    setTimeout(() => setModalType("success"), 0);
  };

  const closeModal = () => { setModalType(null); setActiveIdx(null); };

  return (
    <Page>
      <Header>
        <HeaderInner>
          <TitleBar pageName="스탬프" />
          <TopRight>
            <StampCircleButton size={40} onClick={openGlobalStamp} />
          </TopRight>
        </HeaderInner>
      </Header>

      <ScrollArea>
        <List>
          {stampData && stampData.length>0 ? (
            stampData.map((data) => (
            <MainStampCard
              key={data.id}//도장 데이터 전달
              data={data}
              onClaim={() => openClaim(data.id)}
            />
          ))
          ):(<p>도장이 없습니다.</p>)}
        </List>
      </ScrollArea>

      <Navar />

      {modalType === "stamp" && (
        <StampCodeModal
          data={stampData}//도장 데이터 전달
          onClose={closeModal}
          onSubmit={handleSubmitStamp}//Modal에서 전해준 데이터가 같이 감
        />
      )}

      {modalType === "claim" && activeIdx != null && (
        <RewardCodeModal
          storeName={stores[activeIdx].storeName}
          onClose={closeModal}
          onSubmit={handleSubmitClaim}
        />
      )}

      {modalType === "exists" && activeIdx != null && (
        <AlreadyExistsModal
          storeName={stores[activeIdx].storeName}
          onClose={closeModal}
        />
      )}

      {modalType === "success" && <CouponSuccessModal onClose={closeModal} />}
    </Page>
  );
}

/* ========= styled ========= */
const Page = styled.div`
  width: 100%;
  max-width: 390px;
  height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: #faf8f8;
  overflow: hidden;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: #faf8f8;
  box-shadow: none;
`;

const HeaderInner = styled.div`
  position: relative;
  padding: 0;
  min-height: 60px;
`;

const TopRight = styled.div`
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
`;

const ScrollArea = styled.div`
  flex: 1 1 auto;
  min-height: 0;

  overflow-y: auto;
  overflow-x: hidden;

  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  padding: 0 24px calc(90px + env(safe-area-inset-bottom));

  /* 스크롤바 숨김 */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar{ width:0!important; height:0!important; display:none!important; }

  /* 오버레이 스크롤바 마스킹 */
  --sbw: 14px;
  margin-right: calc(var(--sbw) * -1);
  padding-right: calc(24px + var(--sbw));
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 8px;
  align-items: center;
`;

