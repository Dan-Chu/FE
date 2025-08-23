// src/pages/Mypage/CouponPage.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import TitleBar from "../../components/TitleBar";
import { useNavigate } from "react-router-dom";
import BackIcon from "../../assets/icons/back_mypage.svg?react";
import { CodeInputModal, CouponUseModal } from "../../components/Modal";
import { getCoupons, useCoupon as apiUseCoupon } from "../../shared/api/coupon";
import axios from "axios";
import CloseButton from "../../assets/icons/close_button.svg?react";

export default function CouponPage() {
  const nav = useNavigate();

  // ✅ 상태들
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coupons, setCoupons] = useState([]);

  const [selected, setSelected] = useState(null); // 상세 모달용
  const [askCode, setAskCode] = useState(false); // 코드 입력 모달
  const [showUsed, setShowUsed] = useState(false); // 사용 완료 모달

  // ✅ 날짜 포맷터
  const fmtDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    const mm = `${d.getMonth() + 1}`.padStart(2, "0");
    const dd = `${d.getDate()}`.padStart(2, "0");
    return `${d.getFullYear()}.${mm}.${dd}`;
  };

  // ✅ API 응답을 화면용 모델로 매핑 (필드명이 달라도 최대한 흡수)
  const toVM = (x) => ({
    id: x.id ?? x.couponId ?? x.uuid,
    store: x.storeName ?? x.store?.name ?? "가게",
    title: x.title ?? x.name ?? x.couponName ?? x.description ?? "쿠폰",
    due: fmtDate(x.expirationDate ?? x.expireAt ?? x.expiredAt),
    image: x.imageUrl ?? x.image ?? x.thumbnailUrl ?? "",
    needCode: Boolean(x.needCode ?? x.requiresCode ?? x.requireCode),
  });

  // ✅ 최초 로드: 쿠폰 목록 가져오기
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getCoupons();
        // Swagger 예시가 {success, code, message, data:[...]} 형태이므로 둘 다 대응
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];
        if (!ignore) setCoupons(list.map(toVM));
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 401) {
          setError("로그인이 필요합니다.");
          alert("로그인이 필요합니다.");
          // 필요하면 라우팅
          // nav("/login");
        } else {
          setError(e?.response?.data?.message ?? "쿠폰을 불러오지 못했어요.");
          console.error(e);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [nav]);

  // 상세 → 사용하기 클릭
  const handleUse = () => {
    if (!selected) return;
    setAskCode(true); // 항상 코드 입력 받기
  };

  // 실제 사용 호출
  const doUseCoupon = async (authCode) => {
    if (!selected) return;
    if (!authCode || !authCode.trim()) {
      alert("인증코드를 입력하세요.");
      return;
    }
    try {
      await apiUseCoupon(selected.id, authCode.trim()); // { authCode: "<값>" } 전송
      setAskCode(false);
      setSelected(null);
      setShowUsed(true);
      // TODO: 필요하면 목록 새로고침
      // const res = await getCoupons(); ...
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 401) {
          alert("로그인이 필요합니다.");
          // nav("/login");
          return;
        }
        alert(e.response?.data?.message ?? "쿠폰 사용에 실패했어요.");
      } else {
        alert("알 수 없는 오류가 발생했어요.");
      }
    }
  };

  // 코드 제출 핸들러
  const handleSubmitCode = async (authcode) => {
    await doUseCoupon(authcode);
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
        <HeaderRight /> {/* 비워두거나 우측 액션 버튼 */}
      </PageHeader>

      <ScrollArea>
        {loading && <div style={{ padding: "24px" }}>불러오는 중…</div>}
        {!loading && error && (
          <div style={{ padding: "24px", color: "#cf4721" }}>{error}</div>
        )}
        {!loading && !error && coupons.length === 0 && (
          <div style={{ padding: "24px" }}>사용 가능한 쿠폰이 없어요.</div>
        )}

        {!loading && !error && coupons.length > 0 && (
          <Grid>
            {coupons.map((c) => (
              <Card
                key={c.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setSelected(c);
                }}
              >
                {c.image ? <Thumb src={c.image} alt="" /> : <Thumb as="div" />}
                <Meta>
                  <Store>{c.store}</Store>
                  <Title>{c.title}</Title>
                  <Due>{c.due}</Due>
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
            <CouponClose>
              <CloseButton onClick={() => setSelected(null)}/>
            </CouponClose>
            <CouponInfo $size="16px" $weight="500">
              {selected.store}
            </CouponInfo>
            <CouponInfo $size="32px" $weight="700">
              {selected.title}
            </CouponInfo>
            <CouponTestText>
              * 테스트용 인증코드 {selected.authCode}입니다.
            </CouponTestText>
            {selected.image && <CouponImg src={selected.image} alt="" />}
            <CouponCode placeholder="AAAA" />
            <CouponUse onClick={handleUse}>사용하기</CouponUse>
          </ModalCard>
        </ModalBackdrop>
      )}

      {/* 코드 입력 모달 */}
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

/* ===== styled 그대로 ===== */
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

// 스타일
const PageHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  background: #faf8f8;
  height: 48px;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 48px 1fr 48px; /* 좌/중앙/우 */
  align-items: center;
`;
const HeaderLeft = styled.div`
  grid-column: 1/2;
  display: flex;
  align-items: center;
`;
const HeaderCenter = styled.div`
  grid-column: 2/3;
  display: flex;
  justify-content: center;
`;
const HeaderRight = styled.div`
  grid-column: 3/4;
  display: flex;
  justify-content: flex-end;
`;

const BackFloat = styled.button`
  position: absolute;
  left: -20px;
  top: 4px;
  width: 100px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  &:focus,
  &:focus-visible,
  &:active {
    outline: none;
    box-shadow: none;
  }
  &::-moz-focus-inner {
    border: 0;
  }
  svg {
    width: 20px;
    height: 20px;
  }
`;
const ScrollArea = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  padding: 0 16px calc(90px + env(safe-area-inset-bottom));
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  padding-top: 35px;
`;
const Card = styled.button`
  all: unset;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 20px rgba(0, 0, 0, 0.07);
  cursor: pointer;
`;
const Thumb = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
`;
const Meta = styled.div`
  padding: 10px 12px 12px;
`;
const Store = styled.div`
  color: #5d5d5d;
  font-size: 11px;
  font-weight: 500;
  margin-bottom: 6px;
`;
const Title = styled.div`
  color: #141414;
  font-size: 14px;
  font-weight: 700;
  line-height: 14px;
  margin-bottom: 8px;
`;
const Due = styled.div`
  color: #cf4721;
  font-size: 11px;
  font-weight: 400;
`;

/* ===== Modal ===== */
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;
const ModalCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 326px;
  height: 415px;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.15);
  padding-top: 20px;
  gap: 10px;
`;
const CouponClose = styled.div`
  display: flex;
  width: 280px;
  justify-content: flex-end;
`;
const CouponInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  color: #ce4927;
  text-align: center;
  font-family: Pretendard;
  font-size: ${({ $size }) => $size};
  font-style: normal;
  font-weight: ${({ $weight }) => $weight};
  line-height: ${({ $size }) => $size};
  letter-spacing: -1px;
`;
const CouponTestText = styled.div`
  color: #797979;
  text-align: center;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 12px; /* 0% */
  letter-spacing: -1px;
`;
const CouponImg = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 12px;
  background: url(<path-to-image>) lightgray 50% / cover no-repeat;
`;
const CouponCode = styled.input`
  width: 200px;
  border: none;
  color: #141414;
  text-align: center;
  font-family: Pretendard;
  font-size: 45px;
  font-style: normal;
  font-weight: 600;
  letter-spacing: -0.5px;

  &::placeholder {
    color: #141414;
    text-align: center;
    font-family: Pretendard;
    font-size: 45px;
    font-style: normal;
    font-weight: 600;
    letter-spacing: -0.5px;
  }
`;
const CouponUse = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 326px;
  height: 55.772px;
  border: 0;
  border-radius: 0 0 12px 12px;
  background: #cf4721;
  cursor: pointer;
  bottom: 0;

  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 25px;
  font-style: normal;
  font-weight: 500;
  line-height: 25px;
  letter-spacing: -0.5px;
`;
