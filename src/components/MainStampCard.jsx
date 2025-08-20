import styled from "styled-components";
import stampEmpty from "../assets/icons/stamp_empty.svg";
import stampFilled from "../assets/icons/stamp_filled.svg";
import stampLastEmpty from "../assets/icons/stamp_last_empty.svg";
import stampLastFilled from "../assets/icons/stamp_last_filled.svg";
import needleIcon from "../assets/icons/needle.svg"; 

/**
 * props
 * - store: { storeName, stamps, cyclesCompleted, hasUnclaimedReward }
 * - disabled: boolean
 * - onAction: () => void
 * - onClaim:  () => void
 */
export default function MainStampCard({ data, onClaim }) {

  // ✅ 카드 밖으로 나가지 않도록 최대 3개까지만 표시(필요 시 4개 이상도 쉽게 확장 가능)
  const needlesToShow = data.cardNum;

  return (
    <Card>
      {/* ✅ 상단 우측 바늘 오버레이 */}
      {needlesToShow > 0 && (
        <NeedleWrap aria-hidden="true">
          {Array.from({ length: needlesToShow }).map((_, i) => (
            <NeedleIcon
              key={i}
              src={needleIcon}
              alt=""
              $index={i}
            />
          ))}
        </NeedleWrap>
      )}

      {/* 상단 정보 */}
      <Head>
        <div>
          <Store>가게이름</Store>
          <Title>{data.storeName}</Title>
          <Desc>{data.reward}</Desc>
        </div>
      </Head>

      {/* 스탬프 그리드 */}
      <Grid aria-label={`적립 ${data.currentCount}`}>
        {Array.from({ length: 10 }).map((_, i) => {
          const isLast = i === 9;
          const filled = i < data.currentCount;

          const src = isLast
            ? (filled ? stampLastFilled : stampLastEmpty)
            : (filled ? stampFilled : stampEmpty);

          return <SIcon key={i} src={src} alt="stamp" />;
        })}
      </Grid>

      {/* 완료 → 카드 내부 CTA */}
      {data.currentCount==10 && (
        <ClaimBar type="button" onClick={onClaim}>
          보상 수령하기
        </ClaimBar>
      )}

      {/* 누적 텍스트 */}
      {data.cardNum > 0 && <Foot>누적 {data.cardNum}회</Foot>}
    </Card>
  );
}

/* ===== styles (네가 쓰던 버전 + 바늘 스타일 추가) ===== */

/* 카드 */
const Card = styled.div`
  width: 100%;
  position: relative;              /* ✅ 바늘 오버레이 기준 */
  border-radius: 12px;
  background: #fff;
  border: 1px solid #eee;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);

  --cell: 56px;
  --gap-x: 8px;
  --gap-y: 10px;

  @media (max-width: 360px) {
    --cell: 52px;
    --gap-x: 6px;
    --gap-y: 8px;
  }
`;

/* ✅ 바늘 오버레이 */
const NeedleWrap = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row-reverse;     /* 오른쪽부터 쌓이게 */
  gap: 4px;                        /* 바늘 간격 */
  pointer-events: none;            /* 터치 방해 X */
  max-width: calc(3 * 18px + 2 * 4px);  /* 3개 기준 안전폭 */
`;

/* ✅ 바늘 아이콘: 살짝 각도 변화로 겹쳐 보여도 자연스럽게 */
const NeedleIcon = styled.img`
  width: 18px;
  height: 18px;
  display: block;
  filter: drop-shadow(0 1px 0 rgba(0,0,0,.12));
  transform: ${({ $index }) => `rotate(${ -10 + $index * 6 }deg)`};
`;

/* 상단 정보 */
const Head = styled.div`
  display: block;
  margin-bottom: 8px;
`;
const Store = styled.div`
  color: #CF4721;
  font-family: Pretendard, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans KR", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.2px;
  margin: 0 0 2px;
  text-align: left;
`;
const Title = styled.div`
  color: #141414;
  font-family: Pretendard, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans KR", sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.2px;
  margin: 0 0 4px;
  text-align: left;
`;
const Desc = styled.div`
  color: #5D5D5D;
  font-family: Pretendard, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans KR", sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  margin: 0;
  text-align: left;
`;

/* 스탬프 그리드 */
const Grid = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: var(--gap-y) var(--gap-x);
  place-items: center;
`;
const SIcon = styled.img`
  width: var(--cell);
  height: var(--cell);
  display: block;
`;

/* CTA, 푸터 */
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
