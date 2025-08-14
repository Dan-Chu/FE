import { useState } from "react";
import styled from "styled-components";
import TitleBar from "../../components/TitleBar";

export default function CouponPage() {
  const [selected, setSelected] = useState(null);

  const coupons = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    store: "가게이름",
    title: "쿠폰내용내용내내용",
    due: "사용기한",
    image: `https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDExMDFfMTM3%2FMDAxNzMwNDYzODc5ODU0.meCeuaHml0JG3krvkft2VNL_Lyf1w_AjWdkjDQaYMa0g.IGVflFw0rofsvUsVNUxmJCuoYPiCiawmRQkw7qH6E_4g.JPEG%2FIMG_3311.jpg&type=sc960_832`, // demo
  }));

  return (
    <>
      <Center>
        <Wrap>
          <TitleBar pageName="쿠폰함" />

          <Grid>
            {coupons.map((c) => (
              <Card key={c.id} onClick={() => setSelected(c)}>
                <Thumb src={c.image} alt="" />
                <Meta>
                  <Store>{c.store}</Store>
                  <Title>{c.title}</Title>
                  <Due>{c.due}</Due>
                </Meta>
              </Card>
            ))}
          </Grid>
        </Wrap>
      </Center>

      {/* Modal */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="coupon-modal" onClick={(e) => e.stopPropagation()}>
            <img className="coupon-img" src={selected.image} alt="" />
            <div className="coupon-store">{selected.store}</div>
            <div className="coupon-name">{selected.title}</div>
            <div className="coupon-code">AAAA</div>
            <button className="btn-primary" onClick={() => setSelected(null)}>
              사용하기
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ===== styles ===== */
const Center = styled.div`
display:flex;
justify-content:center;
 width:100%;
width: 100vw;            /* 뷰포트 가로 꽉 채우기 */
min-height: 100svh;      /* 모바일 주소창 고려한 세로 */
display: flex;
justify-content: center; /* 내부 Wrap을 가로 중앙 */
background: #faf8f8;     /* 페이지 배경 있으면 여기 */
`;

const Wrap = styled.div`
width:100%;
max-width:480px;
min-height:100vh;
background:#faf8f8;
padding:16px;
padding-bottom:calc(90px + env(safe-area-inset-bottom));
box-sizing:border-box;
margin: 0 auto;          /* 혹시 flex가 안 먹는 경우도 대비 */
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`;

const Card = styled.button`
  all: unset;
  cursor: pointer;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 6px 16px rgba(0,0,0,0.07);
  overflow: hidden;
`;

const Thumb = styled.img`
  width: 100%;
  height: 125px;
  object-fit: cover;
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
