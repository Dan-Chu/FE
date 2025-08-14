import styled from "styled-components";
import stampEmpty from "../assets/icons/stamp_empty.svg";
import stampFilled from "../assets/icons/stamp_filled.svg";
import stampLastEmpty from "../assets/icons/stamp_last_empty.svg";
import stampLastFilled from "../assets/icons/stamp_last_filled.svg";

/**
 * props
 * - store: { storeName, stamps, cyclesCompleted, hasUnclaimedReward }
 * - disabled: boolean      // 다른 가게에 미수령 보상이 있을 때 잠금 처리
 * - onAction: () => void   // 우측 상단 동그라미 아이콘 클릭 (도장/보상 인증 모달 오픈)
 * - onClaim:  () => void   // 카드 내부 "보상 수령하기" CTA 클릭
 */
export default function MainStampCard({ store, disabled,onClaim }) {
  const { storeName, stamps = 0, hasUnclaimedReward, cyclesCompleted = 0 } = store;
  const completed = hasUnclaimedReward || stamps >= 10; // 완료 상태 시 상단 영역 강조

  return (
    <Card $completed={completed} $disabled={disabled}>
      {/* 상단 정보 */}
      <Head>
        <div>
          <Store>가게이름</Store>
          <Title>{storeName}</Title>
          <Desc>스탬프 10개 모으면 아메리카노 1잔 무료!</Desc>
        </div>
      </Head>

      {/* 스탬프 그리드 */}
      <Grid aria-label={`적립 ${Math.min(stamps, 10)}/10`}>
        {Array.from({ length: 10 }).map((_, i) => {
          const isLast = i === 9;
          // 완료 상태에서는 10개 모두 채워 표시
          const filled = completed ? true : i < stamps;

          const src = isLast
            ? filled ? stampLastFilled : stampLastEmpty
            : filled ? stampFilled : stampEmpty;

          return <SIcon key={i} src={src} alt="stamp" />;
        })}
      </Grid>

      {/* 완료 → 카드 내부 CTA */}
      {hasUnclaimedReward && (
        <ClaimBar type="button" onClick={onClaim}>
          보상 수령하기
        </ClaimBar>
      )}

      {/* 누적 표시 원하면 */}
      {cyclesCompleted > 0 && <Foot>누적 {cyclesCompleted}회</Foot>}

    </Card>
  );
}

/* ===== styles ===== */
const Card = styled.div`
/* width: 301px; 같은 고정폭 있으면 삭제 */
  width: 100%;
  position: relative;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #eee;
  padding: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
  /* ... */
`;


const Head = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

const Store = styled.div`
  color: #cf4721;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const Title = styled.div`
  color: #141414;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.2px;
`;

const Desc = styled.div`
  margin-top: 4px;
  color: #7a7a7a;
  font-size: 12px;
`;

const ActionBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #ffd5c2;
  background: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 2px 6px rgba(0,0,0,.06);
  cursor: ${({disabled}) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({disabled}) => (disabled ? .5 : 1)};
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e2572f;
`;

const Grid = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px 12px;
`;

const SIcon = styled.img`
  width: 40px;
  height: 40px;
  justify-self: center;
`;

const ClaimBar = styled.button`
  margin-top: 12px;
  width: 100%;
  height: 36px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(180deg, #f46a3d 0%, #e34e27 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
`;

const Foot = styled.div`
  margin-top: 8px;
  color: #9a9a9a;
  font-size: 11px;
`;

