import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import TitleBar from "../../components/TitleBar";
import BackIcon from "../../assets/icons/back_mypage.svg?react";
import CloseButton from "../../assets/icons/close_button.svg?react";
import { CodeInputModal, CouponUseModal } from "../../components/Modal";

import { getCoupons, useCoupon as apiUseCoupon } from "../../shared/api/coupon";

export default function CouponPage() {
  const nav = useNavigate();

  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [coupons, setCoupons]   = useState([]);

  const [selected, setSelected] = useState(null);  // 상세 모달용 객체(클릭한 쿠폰)
  const [askCode, setAskCode]   = useState(false); // 코드 입력 모달
  const [showUsed, setShowUsed] = useState(false); // 사용 완료 모달

  const fmtDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    const mm = `${d.getMonth() + 1}`.padStart(2, "0");
    const dd = `${d.getDate()}`.padStart(2, "0");
    return `${d.getFullYear()}.${mm}.${dd}`;
  };

  /** 서버 응답을 화면용 뷰모델로 통일 */
  const toVM = (x) => ({
    id:        x.id ?? x.couponId ?? x.uuid,
    store:     x.storeName ?? x.store?.name ?? "가게",
    title:     x.title ?? x.name ?? x.couponName ?? "쿠폰",
    // 상세/보상/설명 텍스트 최대한 흡수
    desc:      x.description ?? x.benefit ?? x.reward ?? x.rewardName ?? "",
    due:       fmtDate(x.expirationDate ?? x.expireAt ?? x.expiredAt),
    image:     x.imageUrl ?? x.image ?? x.thumbnailUrl ?? "",
    // ← 명시적으로 false일 때만 불필요. 그 외엔 기본적으로 '필요'
    needCode:  !([x.needCode, x.requiresCode, x.requireCode].some(v => v === false)),
    sampleCode: x.authCode ?? x.code ?? x.couponCode ?? "",
  });

  /** 최초 로드 */
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res  = await getCoupons();
        const list =
          Array.isArray(res?.data)      ? res.data :
          Array.isArray(res?.data?.data)? res.data.data : [];
        if (!ignore) setCoupons(list.map(toVM));
      } catch (e) {
        const msg = axios.isAxiosError(e)
          ? (e.response?.status === 401
              ? "로그인이 필요합니다."
              : (e.response?.data?.message ?? "쿠폰을 불러오지 못했어요."))
          : "쿠폰을 불러오지 못했어요.";
        if (!ignore) setError(msg);
        if (axios.isAxiosError(e) && e.response?.status === 401) {
          alert("로그인이 필요합니다.");
          // nav("/login");
        }
        console.error("[Coupons] ", e?.response?.status, e?.response?.data);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [nav]);

  /** 상세 모달의 '사용하기' */
  const handleUseClick = () => {
    if (!selected) return;
    // 코드 필요 여부에 따라 분기
    if (selected.needCode) setAskCode(true);
    else doUseCoupon(); // 코드 불필요
  };

  /** 실제 사용 호출 */
  const doUseCoupon = async (authCode) => {
    if (!selected?.id) return;
    try {
      const code = String(authCode ?? "")
   .replace(/\s|-/g, "")   // 내부 공백/하이픈 제거
   .toUpperCase();         // (영문 대비)
 if (!code) { alert("인증코드를 입력하세요."); return; }
 await apiUseCoupon(selected.id, code);
      setAskCode(false);
      setSelected(null);
      setShowUsed(true);
      // 목록 새로고침(상태 갱신)
      const res  = await getCoupons();
      const list =
        Array.isArray(res?.data)      ? res.data :
        Array.isArray(res?.data?.data)? res.data.data : [];
      setCoupons(list.map(toVM));
    } catch (e) {
      const msg = axios.isAxiosError(e)
        ? (e.response?.data?.message ?? "쿠폰 사용에 실패했어요.")
        : "쿠폰 사용에 실패했어요.";
      alert(msg);
      console.error("[CouponUse] ", e?.response?.status, e?.response?.data);
    }
  };

  /** 코드 입력 모달 제출 */
  const handleSubmitCode = async (authCode) => {
    if (!authCode || !authCode.trim()) {
      alert("인증코드를 입력하세요.");
      return;
    }
    await doUseCoupon(authCode);
  };

  return (
    <Page>
      <PageHeader>
        <HeaderLeft>
          <BackFloat onClick={() => nav(-1)} aria-label="뒤로가기">
            <BackIcon />
          </BackFloat>
        </HeaderLeft>
        <HeaderCenter>
          <TitleBar pageName="쿠폰함" centered hideLogo />
        </HeaderCenter>
        <HeaderRight />
      </PageHeader>

      <ScrollArea>
        {loading && <div style={{ padding: 24 }}>불러오는 중…</div>}
        {!loading && error && <div style={{ padding: 24, color: "#cf4721" }}>{error}</div>}

        {!loading && !error && coupons.length === 0 && (
          <div style={{ padding: 24 }}>사용 가능한 쿠폰이 없어요.</div>
        )}

        {!loading && !error && coupons.length > 0 && (
          <Grid>
            {coupons.map((c) => (
              <Card
                key={c.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => { e.currentTarget.blur(); setSelected(c); }}
              >
                {c.image ? <Thumb src={c.image} alt="" /> : <Thumb as="div" />}
                <Meta>
                  <Store>{c.store}</Store>
                  <Title>{c.title}</Title>
                  {c.due && <Due>{c.due}</Due>}
                </Meta>
              </Card>
            ))}
          </Grid>
        )}
      </ScrollArea>

      {/* 상세 모달 */}
      {selected && !askCode && !showUsed && (
        <ModalBackdrop onClick={() => setSelected(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <CouponClose><CloseButton onClick={() => setSelected(null)} /></CouponClose>
            <CouponInfo $size="16px" $weight="500">{selected.store}</CouponInfo>
            <CouponInfo $size="32px" $weight="700">{selected.title}</CouponInfo>
            {!!selected.desc && <CouponDesc>{selected.desc}</CouponDesc>}
            {selected.image && <CouponImg src={selected.image} alt="" />}
            {!!selected.sampleCode && (
              <CouponHint>* 테스트용 인증코드 {selected.sampleCode}입니다.</CouponHint>
            )}
            <UseBtn type="button" onClick={handleUseClick}>사용하기</UseBtn>
          </ModalCard>
        </ModalBackdrop>
      )}

      {/* 코드 입력 모달(필요한 경우만) */}
      {askCode && !showUsed && (
        <CodeInputModal
          hint="가게에서 받은 인증코드를 입력하세요"
          onClose={() => setAskCode(false)}
          onSubmit={handleSubmitCode}
        />
      )}

      {/* 사용 완료 모달 */}
      {showUsed && <CouponUseModal onClose={() => setShowUsed(false)} />}
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

const PageHeader = styled.header`
  position: sticky; top: 0; z-index: 30; background: #faf8f8;
  height: 48px; padding: 0 16px;
  display: grid; grid-template-columns: 48px 1fr 48px; align-items: center;
`;
const HeaderLeft = styled.div`grid-column: 1/2; display: flex; align-items: center;`;
const HeaderCenter = styled.div`grid-column: 2/3; display: flex; justify-content: center;`;
const HeaderRight = styled.div`grid-column: 3/4; display: flex; justify-content: flex-end;`;

const BackFloat = styled.button`
  position: absolute; left: -20px; top: 4px; width: 100px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: 0; cursor: pointer; outline: none;
  -webkit-tap-highlight-color: transparent;
  &:focus,&:focus-visible,&:active{ outline: none; box-shadow: none; }
  &::-moz-focus-inner{ border: 0; }
  svg { width: 20px; height: 20px; }
`;

const ScrollArea = styled.div`
  flex: 1 1 auto; min-height: 0;
  padding: 0 16px calc(90px + env(safe-area-inset-bottom));
  overflow-y: auto; -webkit-overflow-scrolling: touch; overscroll-behavior: contain;
  scrollbar-width: none; -ms-overflow-style: none;
  &::-webkit-scrollbar { width:0; height:0; }
`;

const Grid = styled.div`
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 14px; padding-top: 35px;
`;
const Card = styled.button`
  all: unset; background: #fff; border-radius: 12px; overflow: hidden;
  box-shadow: 0 20px 20px rgba(0,0,0,.07); cursor: pointer;
`;
const Thumb = styled.img`
  width: 100%; height: 120px; object-fit: cover; display: block;
`;
const Meta = styled.div` padding: 10px 12px 12px; `;
const Store = styled.div` color:#5d5d5d; font-size:11px; font-weight:500; margin-bottom:6px; `;
const Title = styled.div` color:#141414; font-size:14px; font-weight:700; line-height:14px; margin-bottom:8px; `;
const Due = styled.div` color:#cf4721; font-size:11px; font-weight:400; `;

/* Modal */
const ModalBackdrop = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center; z-index: 999;
`;
const ModalCard = styled.div`
  position: relative; display: flex; flex-direction: column; align-items: center;
  width: 326px; min-height: 415px; border-radius: 15px; background: #fff;
  box-shadow: 0 4px 4px rgba(0,0,0,.15); padding: 20px 0 68px; gap: 10px;
`;
const CouponClose = styled.div` display:flex; width:280px; justify-content:flex-end; `;
const CouponInfo = styled.div`
  color:#ce4927; text-align:center; font-family:Pretendard;
  font-size:${({ $size }) => $size}; font-weight:${({ $weight }) => $weight};
  line-height:${({ $size }) => $size}; letter-spacing:-1px;
  margin-top: clamp(10px, 3vh, 24px);
`;
const CouponDesc = styled.div`
  color:#6b6b6b; font-size:13px; line-height:18px; text-align:center;
  padding: 0 16px; white-space: pre-wrap;
`;
const CouponHint = styled.div`
  color:#8f8f8f; font-size:12px; line-height:16px; text-align:center;
`;
const CouponImg = styled.img`
  width: 160px; height: 160px; border-radius: 12px; object-fit: cover;
`;
const UseBtn = styled.button`
  position: absolute; left: 0; right: 0; bottom: 0;
  height: 56px; border: 0; border-radius: 0 0 12px 12px;
  background: #cf4721; color:#fff; font-size:20px; font-weight:700; cursor:pointer;
  -webkit-tap-highlight-color: transparent;
  &:focus,&:active,&:focus-visible{ outline:none; box-shadow:none; }
`;
