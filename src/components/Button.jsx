// src/components/button.jsx
import styled from "styled-components";
import CircleUrl from "../assets/icons/stamp_circle.svg";           // 빨간 원 
import StampOutline from "../assets/icons/stamp_outline.svg?react"; // 흰 도장 

export const StampCircleButton = ({ size = 28, disabled, className, ...props }) => {
  return (
    <StampBtn
      type="button"
      className={className}
      $size={size}
      disabled={disabled}
      {...props}
      aria-label={disabled ? "인증 불가" : "스탬프 인증"}
      title={disabled ? "다른 가게 보상 먼저 수령" : "스탬프 인증"}
    >
      <img src={CircleUrl} alt="" className="bg" />
      <StampOutline className="fg" />
    </StampBtn>
  );
};

const StampBtn = styled.button`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  padding: 0;
  border: 0;
  background: transparent;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .bg {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 50%;
  }

  .fg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
  }

  /* 도장 svg가 stroke/fill을 내부에 고정해도 강제로 하양 */
  .fg [stroke] { stroke: #fff !important; }
  .fg [fill]   { fill:   #fff !important; }
`;
