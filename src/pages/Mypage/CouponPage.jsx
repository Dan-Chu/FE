// src/pages/Mypage/CouponPage.jsx
import { useState } from "react";
import styled from "styled-components";
import TitleBar from "../../components/TitleBar";
import { CodeInputModal } from "../../components/Modal"; // ⬅️ 인증코드 모달 사용

export default function CouponPage() {
  const [selected, setSelected] = useState(null);   // 선택한 쿠폰
  const [askCode, setAskCode] = useState(false);    // 인증코드 모달 ON/OFF

  // 데모 데이터
  const coupons = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    store: "엽기떡볶이",
    title: "무료 치즈 추가",
    due: "2025.11.16",
    image:
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDExMDFfMTM3%2FMDAxNzMwNDYzODc5ODU0.meCeuaHml0JG3krvkft2VNL_Lyf1w_AjWdkjDQaYMa0g.IGVflFw0rofsvUsVNUxmJCuoYPiCiawmRQkw7qH6E_4g.JPEG%2FIMG_3311.jpg&type=sc960_832",
  }));

  // "사용하기" → 인증코드 모달 열기
  const handleUse = () => setAskCode(true);

  // 코드 제출 처리 (데모: 1234만 통과)
  const handleSubmitCode = (code) => {
    if (code === "1234") {
      setAskCode(false);
      setSelected(null);
      alert("쿠폰이 사용되었습니다!"); // 필요 없으면 지워도 됨
    } else {
      alert("인증코드가 올바르지 않습니다.");
    }
  };

  return (
    <Page>
      <Header>
        <TitleBar pageName="쿠폰함" />
      </Header>

      <ScrollArea>
        <Grid>
          {coupons.map((c) => (
            <Card key={c.id} type="button" onClick={() => setSelected(c)}>
              <Thumb src={c.image} alt="" />
              <Meta>
                <Store>{c.store}</Store>
                <Title>{c.title}</Title>
                <Due>{c.due}</Due>
              </Meta>
            </Card>
          ))}
        </Grid>
      </ScrollArea>

      {/* 쿠폰 상세 모달 (코드 모달이 열려있을 땐 숨김) */}
      {selected && !askCode && (
        <ModalBackdrop onClick={() => setSelected(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <img className="coupon-img" src={selected.image} alt="" />
            <div className="coupon-store">{selected.store}</div>
            <div className="coupon-name">{selected.title}</div>

            <button className="btn-primary" onClick={handleUse}>
              사용하기
            </button>
          </ModalCard>
        </ModalBackdrop>
      )}

      {/* 인증코드 입력 모달 */}
      {askCode && (
        <CodeInputModal
          hint="예시 코드는 1234 입니다"
          onClose={() => setAskCode(false)}
          onSubmit={handleSubmitCode}
        />
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
  overflow: hidden; /* 바깥 스크롤 금지 */
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: #faf8f8;
  box-shadow: none; /* 위쪽 라인 제거 */
`;

const ScrollArea = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  padding: 0 16px calc(90px + env(safe-area-inset-bottom));
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  /* 스크롤바 숨김 */
  scrollbar-width: none;        /* Firefox */
  -ms-overflow-style: none;     /* IE/Edge */
  &::-webkit-scrollbar {        /* Chrome/Safari */
    width: 0;
    height: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  padding-top: 8px;
`;

const Card = styled.button`
  all: unset;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
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

/* ===== Modal: 쿠폰 상세 ===== */

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  z-index: 999;
`;

const ModalCard = styled.div`
  width: 320px;
  border-radius: 16px;
  background: #fff;
  padding: 16px;
  text-align: center;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.18);

  .coupon-img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 12px;
  }
  .coupon-store {
    color: #5d5d5d;
    font-size: 12px;
    margin-bottom: 6px;
  }
  .coupon-name {
    color: #141414;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .btn-primary {
    width: 100%;
    height: 46px;
    border: 0;
    border-radius: 12px;
    background: #cf4721;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
  }
`;
