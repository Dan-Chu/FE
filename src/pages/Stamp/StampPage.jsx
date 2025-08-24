// src/pages/Mypage/StampPage.jsx
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import TitleBar from "../../components/TitleBar";
import Navar from "../../components/Navar";
import MainStampCard from "../../components/MainStampCard";
import { StampCodeModal, RewardCodeModal, AlreadyExistsModal, CouponSuccessModal } from "../../components/Modal";
import { StampCircleButton } from "../../components/Button";
import { StampListGet, StampPlus, StampReward } from "../../shared/api/stamp";
import axios from "axios";
import Loading from "../../components/Loading";

/** 서버 응답 → 카드 VM (백엔드 필드명 흡수) */
const toVM = (x = {}) => {
  const id = x.id ?? x.stampId ?? x.uuid ?? x.storeStampId ?? null;
  const storeName = x.storeName ?? x.store?.name ?? x.name ?? "가게";
  const stamps = Number(x.currentCount ?? x.stampCount ?? x.count ?? 0);
  const required = Number(x.requiredCount ?? x.goal ?? 10);
  const cyclesCompleted = Number(x.cyclesCompleted ?? x.completed ?? 0);
  const hasUnclaimedReward = Boolean(
    x.hasUnclaimedReward ?? x.rewardAvailable ?? (required > 0 && stamps >= required)
  );
  return { id, storeName, stamps, required, cyclesCompleted, hasUnclaimedReward };
};

export default function StampPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalType, setModalType] = useState(null); // 'stamp' | 'claim' | 'exists' | 'success' | null
  const [activeIdx, setActiveIdx] = useState(null);

  const fetchedRef = useRef(false);
  const submitLock = useRef(false);
  const claimLock = useRef(false);

  /** 목록 로드 */
  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await StampListGet();
      const vms = (Array.isArray(list) ? list : []).map(toVM);
      setStores(vms);
    } catch (e) {
      const msg = axios.isAxiosError(e)
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

  const openGlobalStamp = () => setModalType("stamp");
  const openClaim = (idx) => { setActiveIdx(idx); setModalType("claim"); };

  /** 스탬프 적립 제출 */
  const handleSubmitStamp = async (code) => {
    const authCode = String(code ?? "").trim();
    if (!authCode) { alert("인증코드를 입력하세요."); return; }
    if (submitLock.current) return;
    submitLock.current = true;

    try {
      const ok = await StampPlus(authCode);   // 200~299 → true, 4xx/5xx → false
      // ✅ 성공/실패와 무관하게 항상 새로고침해서 서버 상태 반영
      setModalType(null);
      setActiveIdx(null);
      await load();
      // 약간의 반영 지연 대비
      setTimeout(load, 300);

      if (!ok) {
        // 실패(예: 409 보상대기)인 경우 안내만
        alert("인증코드가 올바르지 않거나 보상 대기 중이에요. 필요 시 보상 수령을 진행해주세요.");
      }
    } catch (e) {
      const s = e?.response?.status;
      const m = e?.response?.data?.message;
      alert(m ?? (s === 400 ? "인증코드가 올바르지 않습니다." : "스탬프 적립에 실패했어요."));
      console.error("[StampPlus] ", s, e?.response?.data);
    } finally {
      submitLock.current = false;
    }
  };

  /** 보상 수령 제출 */
  const handleSubmitClaim = async () => {
    if (activeIdx == null) return;
    const target = stores[activeIdx];
    if (!target?.id) { alert("스탬프 정보를 찾을 수 없어요."); return; }
    if (claimLock.current) return;
    claimLock.current = true;

    try {
      const ok = await StampReward(target.id);
      if (!ok) { alert("보상 수령에 실패했어요."); return; }
      setModalType(null);
      setActiveIdx(null);
      setTimeout(() => setModalType("success"), 0);
      await load();
      setTimeout(load, 300);
    } catch (e) {
      const s = e?.response?.status;
      const m = e?.response?.data?.message;
      if (s === 400) alert(m ?? "조건을 충족하지 않았습니다.");
      else if (s === 404) alert("스탬프를 찾을 수 없어요.");
      else if (s === 409) alert("이미 수령된 보상입니다.");
      else alert(m ?? "보상 수령에 실패했어요.");
      console.error("[StampReward] ", s, e?.response?.data);
    } finally {
      claimLock.current = false;
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
        {loading && <Loading/>}
        {!loading && error && <div style={{ padding: 24, color: "#cf4721" }}>{error}</div>}

        {!loading && !error && (
          <List>
            {stores.map((store, idx) => (
              <MainStampCard
                key={(store.id ?? store.storeName) + "_" + idx}
                store={store}
                onClaim={() => openClaim(idx)}
              />
            ))}
            {stores.length === 0 && <div style={{ padding: 24 }}>아직 적립된 스탬프가 없어요.</div>}
          </List>
        )}
      </ScrollArea>

      <Navar />

      {/* 전역 스탬프 적립 */}
      {modalType === "stamp" && (
        <StampCodeModal onClose={closeModal} onSubmit={handleSubmitStamp} />
      )}

      {/* 보상 수령 */}
      {modalType === "claim" && activeIdx != null && (
        <RewardCodeModal
          storeName={stores[activeIdx]?.storeName ?? ""}
          onClose={closeModal}
          onSubmit={handleSubmitClaim}
        />
      )}

      {/* (옵션) 이미 보상 대기중 알림 */}
      {modalType === "exists" && activeIdx != null && (
        <AlreadyExistsModal
          storeName={stores[activeIdx]?.storeName ?? ""}
          onClose={closeModal}
        />
      )}

      {/* 보상 수령 성공 */}
      {modalType === "success" && <CouponSuccessModal onClose={closeModal} />}
    </Page>
  );
}

/* ===== styled ===== */
const Page = styled.div`
  width: 100%;
  max-width: 390px;
  height: 100dvh;
  margin: 0 auto;
  display: flex; flex-direction: column;
  background: #faf8f8; overflow: hidden;
`;
const Header = styled.div` position: sticky; top: 0; z-index: 20; background: #faf8f8; box-shadow: none; margin: 0 0 37px; `;
const HeaderInner = styled.div` position: relative; padding: 0; min-height: 60px; `;
const TopRight = styled.div` position: absolute; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1; margin: 37px 0; `;
const ScrollArea = styled.div`
  flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden;
  -webkit-overflow-scrolling: touch; overscroll-behavior: contain;
  padding: 0 24px calc(90px + env(safe-area-inset-bottom));
  scrollbar-width: none; -ms-overflow-style: none;
  &::-webkit-scrollbar { width:0!important; height:0!important; display:none!important; }
  --sbw:14px; margin-right: calc(var(--sbw)*-1); padding-right: calc(24px + var(--sbw));
`;
const List = styled.div` display:flex; flex-direction:column; gap:12px; padding-bottom:8px; align-items:center; `;
