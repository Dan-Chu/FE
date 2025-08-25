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
 */
export default function MainStampCard({ store, stampsForView, disabled, onClaim }) {
  const {
    storeName = "가게",
    stamps = 0,
    required = store?.required ?? store?.requiredCount ?? store?.goal ?? 10,
    cyclesCompleted = 0,
    hasUnclaimedReward = false,
  } = store ?? {};

  const cap = Math.max(1, Number(required) || 10);
  const nRaw = Math.max(0, Number(stampsForView ?? stamps) || 0);
  // 수령 가능(READY)이면 꽉 찬 모습 + 버튼
  const isReady = hasUnclaimedReward || nRaw >= cap;
  const n = isReady ? cap : Math.min(nRaw, cap);

    // ✅ 바늘 개수 = 서버 방문/완성 횟수(cardNum 우선)
  const needleCount = Math.max(
    0,
    Number(store?.cardNum ?? store?.cyclesCompleted ?? 0) || 0
  );
  const needlesToShow = Math.min(needleCount, 3);
  const extra         = Math.max(0, needleCount - 3);

 // 남은 스탬프 표시 문구
  const prog = cap > 0 ? (nRaw % cap) : nRaw;   // 이번 사이클에서 채운 칸 수
  const left = isReady ? 0 : (cap - prog);      // 보상까지 남은 개수

  

  return (
    <Card $completed={isReady} $disabled={disabled}>
      {/* 바늘 오버레이 */}
      {cyclesCompleted > 0 && (
        <NeedleWrap aria-label={`누적 ${cyclesCompleted}회`}>
          <NeedleStack>
            {Array.from({ length: needlesToShow }).map((_, i) => (
              <NeedleImg key={i} src={needleIcon} alt="" />
            ))}
          </NeedleStack>
          {extra > 0 && <NeedleBadge>+{extra}</NeedleBadge>}
        </NeedleWrap>
      )}

      <Head>
        <div>
           <Title>{storeName}</Title>
          {/* 동적 문구: 보상까지 N개 남음 / 보상 수령 가능 */}
          <Desc>
            {isReady
              ? "보상 수령 가능!"
              : `보상까지 ${left}개 남음`}
          </Desc>
        </div>
          </Head>

      <Grid aria-label={`적립 ${Math.min(n, cap)}/${cap}`}>
        {Array.from({ length: cap }).map((_, i) => {
          const isLast = i === cap - 1;
          const filled = i < Math.min(n, cap - 1); // 마지막 칸 제외 채움
          const lastDone = n >= cap;                // 코너(마지막) 채움 여부
          return (
            <Cell key={i} $noBg={isReady || isLast} $corner={isLast ? 60 : 22}>
              {isLast
                ? (lastDone
                    ? <MarkCorner src={stampLastFilled} alt="" />
                    : <MarkCorner src={stampLastEmpty} alt="" />)
                : (filled && <MarkCenter src={stampFilled} alt="" />)}
            </Cell>
          );
        })}
      </Grid>

      {isReady && (
        <ClaimBar type="button" onClick={onClaim}>
          보상 수령하기
        </ClaimBar>
      )}
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

/* 바늘 우상단 오버레이 */
const NeedleWrap = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex; align-items: center; gap: 6px;
  z-index: 2; pointer-events: none;
`;
const NeedleStack = styled.div`
  display: flex; gap: 4px;
`;
const NeedleImg = styled.img`
  width: 18px; height: 18px; display: block;
`;
const NeedleBadge = styled.span`
  padding: 1px 6px; border-radius: 999px;
  font-size: 11px; font-weight: 700; line-height: 16px;
  color: #ff6b4a; background: #fff; border: 1px solid #ffd6cc;
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
  width:var(--cell); height:var(--cell);
  border-radius:14px; position:relative; overflow:hidden;
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