// src/pages/Mypage/StampPage.jsx
import { useEffect, useRef, useState } from "react";
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

import {
  StampListGet,
  StampPlus,
  StampReward,
  // ExpiringStampGet, // 필요하면 사용
} from "../../shared/api/stamp";
import axios from "axios";

/** 서버 응답 → 카드에 필요한 형태로 매핑 (필드명이 달라도 최대한 흡수) */
const toVM = (x) => {
  const id =
    x?.id ?? x?.stampId ?? x?.uuid ?? x?.storeStampId ?? null;

  const storeName =
    x?.storeName ?? x?.store?.name ?? x?.name ?? "가게";

  // 현재 적립 개수
  const stamps =
    x?.currentCount ?? x?.stampCount ?? x?.count ?? 0;

  // 1사이클 목표 개수(없으면 10으로 가정)
  const required =
    x?.requiredCount ?? x?.goal ?? 10;

  // 완료 사이클 수
  const cyclesCompleted =
    x?.cyclesCompleted ?? x?.completed ?? 0;

  // 보상 대기 여부
  const hasUnclaimedReward =
    Boolean(
      x?.hasUnclaimedReward ??
      x?.rewardAvailable ??
      (stamps >= required)
    );

  return { id, storeName, stamps, required, cyclesCompleted, hasUnclaimedReward };
};

export default function StampPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // 'stamp' | 'claim' | 'exists' | 'success' | null
  const [modalType, setModalType] = useState(null);
  const [activeIdx, setActiveIdx] = useState(null);

  // 개발모드(StrictMode)에서 useEffect 두 번 실행 방지
  const fetchedRef = useRef(false);

  /** 목록 로드 */
  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await StampListGet(); // 서버 래핑/비래핑은 stamp.js가 처리
      const vms = (Array.isArray(list) ? list : []).map(toVM);
      setStores(vms);
    } catch (e) {
      const msg =
        axios.isAxiosError(e)
          ? (e.response?.data?.message ?? "스탬프를 불러오지 못했어요.")
          : "스탬프를 불러오지 못했어요.";
      setError(msg);
      console.error("[StampList] ", e?.response?.status, e?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    load();
  }, []);

  /** 전역 ‘스탬프 적립’ 버튼 → 코드 입력 모달 오픈 */
  const openGlobalStamp = () => setModalType("stamp");

  /** 특정 매장 보상 수령 버튼 → 코드 입력 모달 오픈(코드는 현재 API에선 미사용) */
  const openClaim = (idx) => {
    setActiveIdx(idx);
    setModalType("claim");
  };

  /** 스탬프 적립 제출 (인증코드) */
  const handleSubmitStamp = async (code) => {
    const authCode = String(code ?? "").trim();
    if (!authCode) {
      alert("인증코드를 입력하세요.");
      return;
    }
    try {
      const ok = await StampPlus(authCode);
      if (!ok) {
        // 서버가 400(코드 불일치) 같은 걸 준 케이스
        alert("인증코드가 올바르지 않거나 만료되었어요.");
        return;
      }
      setModalType(null);
      setActiveIdx(null);
      await load();
    } catch (e) {
      const s = e?.response?.status;
      const m = e?.response?.data?.message;
      alert(m ?? (s === 400 ? "인증코드가 올바르지 않습니다." : "스탬프 적립에 실패했어요."));
      console.error("[StampPlus] ", s, e?.response?.data);
    }
  };

  /** 보상 수령 제출 (현재 API는 코드 불필요) */
  const handleSubmitClaim = async () => {
    if (activeIdx == null) return;
    const target = stores[activeIdx];
    if (!target?.id) {
      alert("스탬프 정보를 찾을 수 없어요.");
      return;
    }
    try {
      const ok = await StampReward(target.id);
      if (!ok) {
        alert("보상 수령에 실패했어요.");
        return;
      }
      setModalType(null);
      setActiveIdx(null);
      // 성공 모달 → 목록 새고로침
      setTimeout(() => setModalType("success"), 0);
      await load();
    } catch (e) {
      const s = e?.response?.status;
      const m = e?.response?.data?.message;
      if (s === 400) alert(m ?? "조건을 충족하지 않았습니다.");
      else if (s === 404) alert("스탬프를 찾을 수 없어요.");
      else if (s === 409) alert("이미 수령된 보상입니다.");
      else alert(m ?? "보상 수령에 실패했어요.");
      console.error("[StampReward] ", s, e?.response?.data);
    }
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
        {loading && <div style={{ padding: "24px" }}>불러오는 중…</div>}
        {!loading && error && (
          <div style={{ padding: "24px", color: "#cf4721" }}>{error}</div>
        )}

        {!loading && !error && (
          <List>
            {stores.map((store, idx) => (
              <MainStampCard
                key={(store.id ?? store.storeName) + "_" + idx}
                store={store}
                onClaim={() => openClaim(idx)}
              />
            ))}
            {stores.length === 0 && (
              <div style={{ padding: "24px" }}>아직 적립된 스탬프가 없어요.</div>
            )}
          </List>
        )}
      </ScrollArea>

      <Navar />

      {/* 전역 스탬프 적립(코드 입력) */}
      {modalType === "stamp" && (
        <StampCodeModal
          storeName=""            // 전역 코드라 매장명 미표기
          onClose={closeModal}
          onSubmit={handleSubmitStamp}
        />
      )}

      {/* 보상 수령(코드 입력 모달은 UX상 유지, 현재 API는 코드 미사용) */}
      {modalType === "claim" && activeIdx != null && (
        <RewardCodeModal
          storeName={stores[activeIdx]?.storeName ?? ""}
          onClose={closeModal}
          onSubmit={handleSubmitClaim}
        />
      )}

      {/* (옵션) 이미 보상 대기중 알림 — 사전 차단 로직이 없으므로 현재는 사용 안 함 */}
      {modalType === "exists" && activeIdx != null && (
        <AlreadyExistsModal
          storeName={stores[activeIdx]?.storeName ?? ""}
          onClose={closeModal}
        />
      )}

      {/* 보상 수령 성공 모달 (쿠폰 발급) */}
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
  margin: 0px 0 37px;
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
  margin: 37px 0 37px;
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
  &::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none !important; }

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