import styled from "styled-components";
import stampFilled from "../assets/icons/stamp_filled.svg";
import stampLastEmpty from "../assets/icons/stamp_last_empty.svg";
import stampLastFilled from "../assets/icons/stamp_last_filled.svg";
import needleIcon from "../assets/icons/needle.svg";

/**
 * props
 * - store: { storeName, stamps, required, cyclesCompleted, hasUnclaimedReward, rewardText? }
 * - disabled?: boolean
 * - onClaim?: () => void
 * - needle?: boolean        // 보상 직후 바늘 표시 (카드 내부 우측 끝)
 */
export default function MainStampCard({ store, disabled, onClaim, needle = false }) {
  const {
    storeName = "가게",
    stamps = 0,
    cyclesCompleted = 0,
    required = store?.required ?? store?.requiredCount ?? store?.goal ?? 10,
    hasUnclaimedReward = false,
    rewardText = "",
  } = store ?? {};

  const cap   = Math.max(1, Number(required) || 10);   // 총 칸 수
  const nRaw  = Math.max(0, Number(stamps)   || 0);    // 서버 카운트
  const rem   = cap > 0 ? (nRaw % cap) : nRaw;

  // 보상 직후 서버 count=1 → 화면에선 0개처럼 보이게 -1 보정
  const showNeedle = !!needle && rem === 1;
  const nForGrid   = showNeedle ? Math.max(0, nRaw - 1) : nRaw;

  // 수령 가능(READY) 상태면 꽉 찬 모습 + 버튼
  const isReady    = hasUnclaimedReward || nRaw >= cap;
  const n          = isReady ? cap : Math.min(nForGrid, cap);

  const canClaim   = isReady;
  const completed  = canClaim;

  return (
    <Card $completed={completed} $disabled={disabled}>
      {/* 카드 내부 우측 끝 바늘 (하나) */}
      {showNeedle && (
        <NeedleOne aria-hidden="true">
          <img src={needleIcon} alt="" />
        </NeedleOne>
      )}

      <Head>
        <div>
          <Title>{storeName}</Title>
          <Desc>{rewardText || `스탬프 ${cap}개 모으면 보상!`}</Desc>
        </div>
      </Head>

      <Grid aria-label={`적립 ${Math.min(n, cap)}/${cap}`}>
        {Array.from({ length: cap }).map((_, i) => {
          const isLast   = i === cap - 1;
          const filled   = i < Math.min(n, cap - 1); // 마지막 칸 제외 채움
          const lastDone = n >= cap;                 // 코너(마지막) 채움 여부
          return (
            <Cell
              key={i}
              $noBg={isReady || isLast}   // READY면 모든 칸 배경 제거, 아니면 마지막 칸만 제거
              $corner={isLast ? 60 : 22}
            >
              {isLast
                ? (lastDone
                    ? <MarkCorner src={stampLastFilled} alt="" />
                    : <MarkCorner src={stampLastEmpty} alt="" />)
                : (filled && <MarkCenter src={stampFilled} alt="" />)}
            </Cell>
          );
        })}
      </Grid>

      {canClaim && (
        <ClaimBar type="button" onClick={onClaim}>
          보상 수령하기
        </ClaimBar>
      )}

      {cyclesCompleted > 0 && <Foot>누적 {cyclesCompleted}회</Foot>}
    </Card>
  );
}

/* ===== styles ===== */
const Card = styled.div`
  width: 100%;
  position: relative;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #eee;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
  ${({ $completed }) => $completed && `background:#fff7f5; border-color:#ffd6cc;`}
  --cell: 56px; --gap-x: 8px; --gap-y: 10px;
  @media (max-width:360px){ --cell:52px; --gap-x:6px; --gap-y:8px; }
`;

/* 카드 내부 '완전 오른쪽' 바늘 */
const NeedleOne = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  z-index: 2;
  pointer-events: none;
  img { display:block; width:100%; height:100%; }
`;

const Head = styled.div` display:block; margin-bottom:8px; `;
const Title = styled.div` color:#141414; font-size:18px; font-weight:700; line-height:24px; letter-spacing:-0.2px; margin:0 0 4px; text-align:left; `;
const Desc = styled.div` color:#5D5D5D; font-size:14px; font-weight:500; line-height:20px; margin:0; text-align:left; `;

const Grid = styled.div`
  margin-top:10px;
  display:grid;
  grid-template-columns:repeat(5, minmax(0,1fr));
  gap:var(--gap-y) var(--gap-x);
  place-items:center;
`;

const Cell = styled.div`
  --corner:${({$corner})=>($corner?`${$corner}px`:'22px')};
  width:var(--cell);
  height:var(--cell);
  border-radius:14px;
  position:relative;
  overflow:hidden;
  background:${({ $noBg }) => ($noBg ? "transparent" : "#f9e9e7")};
  ${({$noBg}) => $noBg && `border-radius:0; overflow:visible;`}
`;

const MarkCenter = styled.img`
  position:absolute; inset:0; margin:auto;
  width:72%; height:72%; object-fit:contain; pointer-events:none;
`;
const MarkCorner = styled.img`
  position:absolute; right:0; bottom:-2px;
  width:var(--corner); height:var(--corner); object-fit:contain; pointer-events:none;
`;

const ClaimBar = styled.button`
  margin-top:12px; width:100%; height:40px;
  border-radius:10px; background:#ff6b4a; color:#fff;
  border:0; font-weight:700; cursor:pointer;
`;
const Foot = styled.div` margin-top:6px; color:#8b8b8b; font-size:12px; text-align:right; `;
