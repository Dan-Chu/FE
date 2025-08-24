import { useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

export default function FlipCard({
  front,
  back,
  width = "100%",
  height = 180,
  axis = "Y",               // "Y"(좌우) or "X"(상하) 회전
  disabled,
  isFlipped,               // (선택) 제어 컴포넌트로 쓰고 싶을 때
  defaultFlipped = false,  // (선택) 초기 상태
  onFlipChange,            // (선택) 상태 콜백
}) {
  const [inner, setInner] = useState(defaultFlipped);
  const flipped = isFlipped ?? inner;
  const toggle = () => {
    if (disabled) return;
    const next = !flipped;
    setInner(next);
    onFlipChange?.(next);
  };

  const rotateKey = axis === "X" ? "rotateX" : "rotateY";

  return (
    <Wrap style={{ width, height }} onClick={toggle}>
      <Card3D
        animate={{ [rotateKey]: flipped ? 180 : 0 }}
        initial={false}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        $disabled={disabled}
      >
        <FaceFront>{front}</FaceFront>
        <FaceBack style={{ transform: `rotate${axis}(180deg)` }}>
          {back}
        </FaceBack>
      </Card3D>
    </Wrap>
  );
}

/* ===== styles ===== */
const Wrap = styled.div`
  perspective: 1000px;
`;

const Card3D = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  will-change: transform;
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  border-radius: 12px; /* 자식이 둥글면 이 값과 맞춰줘 */
`;

const faceBase = `
  position: absolute;
  inset: 0;
  border-radius: inherit;
  backface-visibility: hidden;
  /* 자식이 카드 전체를 채우게 */
  & > * { width: 100%; height: 100%; border-radius: inherit; }
`;

const FaceFront = styled.div`${faceBase}`;
const FaceBack  = styled.div`${faceBase}`;
