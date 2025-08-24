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
export default function MainStampCard({ store, disabled, onClaim }) {
  const {
    storeName = "가게",
    stamps = 0,
    cyclesCompleted = 0,
    // ✅ 목표 개수는 API 값만 사용(동의어 흡수, 정말 없을 때만 표시용 10)
    required = store?.required ?? store?.requiredCount ?? store?.goal ?? 10,
    // 서버가 플래그 안 줄 수도 있으므로 숫자 비교와 OR
    hasUnclaimedReward = false,
    rewardText = "",
  } = store ?? {};

  const cap = Math.max(1, Number(required) || 10); // 표시용 안전값
  const n   = Math.max(0, Number(stamps)   || 0);

  // ✅ 수령 가능 판단: 서버 플래그 || 숫자 비교
  const canClaim = Boolean(hasUnclaimedReward || (n >= cap));
  const completed = canClaim; // 카드 스타일용

  const needlesToShow = Math.min(Number(cyclesCompleted) || 0, 3);

  return (
    <Card $completed={completed} $disabled={disabled}>
      {/* 상단 우측 바늘 */}
      {needlesToShow > 0 && (
        <NeedleWrap aria-hidden="true">
          {Array.from({ length: needlesToShow }).map((_, i) => (
            <NeedleIcon key={i} src={needleIcon} alt="" $index={i} />
          ))}
        </NeedleWrap>
      )}

      {/* 상단 정보 */}
      <Head>
        <div>
          <Title>{storeName}</Title>
          <Desc>{rewardText || `스탬프 ${cap}개 모으면 보상!`}</Desc>
        </div>
      </Head>

      {/* 스탬프 그리드 (API 목표 개수 기준) */}
      <Grid aria-label={`적립 ${Math.min(n, cap)}/${cap}`}>
        {Array.from({ length: cap }).map((_, i) => {
          const isLast   = i === cap - 1;
          const filled   = i < Math.min(n, cap - 1);
          const lastDone = n >= cap;
          return (
            <Cell key={i} $noBg={isLast} $corner={isLast ? 60 : 22}>
              {isLast
                ? (lastDone ? <MarkCorner src={stampLastFilled} alt="" /> : <MarkCorner src={stampLastEmpty} alt="" />)
                : (filled && <MarkCenter src={stampFilled} alt="" />)}
            </Cell>
          );
        })}
      </Grid>

      {/* 완료 → 카드 CTA (API 값으로만 판단) */}
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
const NeedleWrap = styled.div`
  position:absolute; top:10px; right:10px; display:flex; flex-direction:row-reverse; gap:4px; pointer-events:none;
`;
const NeedleIcon = styled.img`
  width:18px; height:18px; display:block; filter:drop-shadow(0 1px 0 rgba(0,0,0,.12));
  transform:${({$index})=>`rotate(${-10 + $index * 6}deg)`};
`;
const Head = styled.div` display:block; margin-bottom:8px; `;
const Title = styled.div` color:#141414; font-size:18px; font-weight:700; line-height:24px; letter-spacing:-0.2px; margin:0 0 4px; text-align:left; `;
const Desc = styled.div` color:#5D5D5D; font-size:14px; font-weight:500; line-height:20px; margin:0; text-align:left; `;
const Grid = styled.div` margin-top:10px; display:grid; grid-template-columns:repeat(5, minmax(0,1fr)); gap:var(--gap-y) var(--gap-x); place-items:center; `;
const Cell = styled.div`
  --corner:${({$corner})=>($corner?`${$corner}px`:'22px')};
  width:var(--cell); height:var(--cell); border-radius:14px; position:relative; overflow:hidden; background:#f9e9e7;
  ${({$noBg})=>$noBg && `background:transparent; border-radius:0; overflow:visible;`}
`;
const MarkCenter = styled.img` position:absolute; inset:0; margin:auto; width:72%; height:72%; object-fit:contain; pointer-events:none; `;
const MarkCorner = styled.img` position:absolute; right:0; bottom:-2px; width:var(--corner); height:var(--corner); object-fit:contain; pointer-events:none; `;
const ClaimBar = styled.button` margin-top:12px; width:100%; height:40px; border-radius:10px; background:#ff6b4a; color:#fff; border:0; font-weight:700; cursor:pointer; `;
const Foot = styled.div` margin-top:6px; color:#8b8b8b; font-size:12px; text-align:right; `;
