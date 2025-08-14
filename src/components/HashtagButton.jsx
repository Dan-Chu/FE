// src/components/common/HashtagButton.jsx
import styled from "styled-components";

export default function HashtagButton({
  selected,
  onChange,
  offSrc,
  onSrc,
  label = "해시태그",
  width = 88,
  height = 36,
  disabled = false,
  className,
}) {
  return (
    <Btn
      type="button"
      className={className}
      onClick={() => !disabled && onChange?.(!selected)}
      aria-pressed={selected}
      aria-label={label}
      title={label}
      $bg={selected ? onSrc : offSrc}
      $w={width}
      $h={height}
      disabled={disabled}
    >
      <Hidden>{label}</Hidden>
    </Btn>
  );
}

const Btn = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;

  width: ${(p) => p.$w}px;
  height: ${(p) => p.$h}px;
  background-image: url(${(p) => p.$bg});
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 999px;

  &:focus-visible {
    box-shadow: 0 0 0 3px #ff5a2f33;
  }
  &:disabled { opacity: 0.5; cursor: default; }
`;

const Hidden = styled.span`
  position: absolute;
  width: 1px; height: 1px;
  overflow: hidden; clip-path: inset(50%);
`;
