import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import TitleBar from "../../components/TitleBar";
import Navar from "../../components/Navar";
import MainStampCard from "../../components/MainStampCard";
import {
  AlreadyExistsModal,
  CouponSuccessModal,
} from "../../components/Modal";
import { StampCircleButton } from "../../components/Button";
import { StampListGet, StampPlus, StampReward } from "../../shared/api/stamp";
import axios from "axios";
import Loading from "../../components/Loading";

/* 서버에서 어떤 이름으로 오든 id 추출 */
const pickId = (x = {}) =>
  x.stampId ?? x.storeStampId ?? x.store?.stampId ?? x.id ?? x.uuid ?? null;

/** 서버 응답 → 카드 VM (백엔드 필드명 흡수) */
const toVM = (x = {}) => {
  const id = pickId(x);

  const storeName = x.storeName ?? x.store?.name ?? x.name ?? "가게";
  const stamps    = Number(x.currentCount ?? x.stampCount ?? x.count ?? 0);
  const required  = Number(x.requiredCount ?? x.goal ?? 10);

  // ✅ 바늘(방문 횟수) = 서버 값만 사용: cardNum 우선
  const cyclesCompleted = Number(
    x.cardNum ?? x.cyclesCompleted ?? x.completed ?? x.rewardCount ?? 0
  );

  const status = (x.status ?? "").toString().toUpperCase();
  const hasUnclaimedReward = status
    ? status === "READY_TO_CLAIM"
    : Boolean(
        x.hasUnclaimedReward ??
          x.rewardAvailable ??
          (required > 0 && stamps >= required)
      );

  return { id, storeName, stamps, required, cyclesCompleted, hasUnclaimedReward, cardNum: cyclesCompleted };
};

export default function StampPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalType, setModalType] = useState(null); // 'stamp' | 'exists' | 'success' | null

  const fetchedRef = useRef(false);
  const submitLock = useRef(false);
  const claimLock  = useRef(false);

  // ✅ 보상 직후 서버가 stamps=1로 보내는 경우, 화면에선 0처럼 보이도록 숨김
  const [suppressMap, setSuppressMap] = useState({}); // { [stampId]: true }

  /** 목록 로드 */
  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await StampListGet();

      const built = (Array.isArray(list) ? list : []).map(toVM);
      setStores(built);

      // rem === 1 일 때만 숨김 유지, 아니면 해제
      setSuppressMap((prev) => {
        const next = { ...prev };
        for (const s of built) {
          const cap = s.required > 0 ? s.required : 10;
          const rem = cap > 0 ? (s.stamps % cap) : s.stamps;
          if (rem !== 1) delete next[s.id];
        }
        return next;
      });

      return built;
    } catch (e) {
      const msg = axios.isAxiosError(e)
        ? e.response?.data?.message ?? "스탬프를 불러오지 못했어요."
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

  /** 스탬프 적립 제출 */
  const handleSubmitStamp = async (code) => {
    const authCode = String(code ?? "").trim();
    if (!authCode) return alert("인증코드를 입력하세요.");
    if (submitLock.current) return;
    submitLock.current = true;

    try {
      const { ok, status } = await StampPlus(authCode);
      setModalType(null);
      await load();
      setTimeout(load, 300);

      if (!ok) {
        if (status === 409) alert("보상 대기 중인 스탬프가 있어요. 보상 수령을 진행해주세요.");
        else if (status === 400) alert("인증코드가 올바르지 않습니다.");
        else alert("스탬프 적립에 실패했어요.");
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

  /** 보상 수령 → 방문횟수는 서버(cardNum) 기준 / 스탬프는 0처럼 보이게 */
  const handleClaimClick = async (idx) => {
    if (idx == null) return;
    const target = stores[idx];
    if (!target?.id && target?.id !== 0) {
      alert("스탬프 정보를 찾을 수 없어요.");
      return;
    }
    if (claimLock.current) return;
    claimLock.current = true;

    try {
      const ok = await StampReward(target.id);
      if (!ok) {
        alert("보상 수령에 실패했어요.");
        return;
      }

      // 화면 즉시 반영: 스탬프 0부터(서버가 1 보내도 아래 suppressMap으로 숨김)
      setStores((prev) =>
        prev.map((s) =>
          s.id === target.id
            ? { ...s, hasUnclaimedReward: false, stamps: 0 }
            : s
        )
      );

      // 서버가 rem=1로 보낼 수 있으니 일시적으로 숨김 ON
      setSuppressMap((p) => ({ ...p, [target.id]: true }));

      setModalType("success");

      // 서버 동기화 (cardNum 업데이트는 서버 값 그대로 사용)
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

  /** 성공 모달 닫기 */
  const handleCloseSuccess = () => setModalType(null);
  const closeModal = () => setModalType(null);

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
        {loading && <Loading />}
        {!loading && error && (
          <div style={{ padding: 24, color: "#cf4721" }}>{error}</div>
        )}

        {!loading && !error && (
          <List>
            {stores.map((store, idx) => {
              // claim 직후(서버 rem=1)면 화면에서만 1개 숨김
              const cap = store.required > 0 ? store.required : 10;
              const rem = cap > 0 ? (store.stamps % cap) : store.stamps;
              const hideOne = !!suppressMap[store.id] && rem === 1;
              const stampsForView = hideOne ? Math.max(0, store.stamps - 1) : store.stamps;

              return (
                <MainStampCard
                  key={(store.id ?? store.storeName) + "_" + idx}
                  store={store}
                  stampsForView={stampsForView}  // 표시용 스탬프 전달
                  onClaim={() => handleClaimClick(idx)}
                />
              );
            })}
            {stores.length === 0 && (
              <div style={{ padding: 24 }}>아직 적립된 스탬프가 없어요.</div>
            )}
          </List>
        )}
      </ScrollArea>

      <Navar />

      {/* 전역 스탬프 적립 */}
      {modalType === "stamp" && (
        <StampCodeModal onClose={closeModal} onSubmit={handleSubmitStamp} />
      )}

      {/* (옵션) 이미 보상 대기중 알림 */}
      {modalType === "exists" && (
        <AlreadyExistsModal storeName="-" onClose={closeModal} />
      )}

      {/* 보상 수령 성공 — 확인 누르면 닫기만 */}
      {modalType === "success" && (
        <CouponSuccessModal onClose={handleCloseSuccess} />
      )}
    </Page>
  );
}

/* ===== styled ===== */
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
  margin: 0 0 37px;
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
  margin: 37px 0;
`;
const ScrollArea = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding: 0 24px calc(90px + env(safe-area-inset-bottom));
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none !important; }
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
