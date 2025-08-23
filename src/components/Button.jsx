import styled from "styled-components";
import { useRef } from "react";

import CircleUrl from "../assets/icons/stamp_circle.svg";           
import StampOutline from "../assets/icons/stamp_outline.svg?react"; 

import EditIcon from "../assets/icons/edit.svg?react";              // 연필 
import CameraIcon from "../assets/logos/edit_profile_picture.svg?react"; // 아이콘(외곽 원 포함)


// 스탬프 동그라미 버튼 (기존 그대로)
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

  &:disabled { cursor: not-allowed; opacity: 0.5; }

  .bg { width: 100%; height: 100%; display: block; border-radius: 50%; }
  .fg {
    position: absolute; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 60%; height: 60%;
  }
  .fg [stroke] { stroke: #fff !important; }
  .fg [fill]   { fill:   #fff !important; }
`;


// 연필 버튼
//  - ring=false: SVG가 원을 포함하고 있을 때(겹침 방지)
//  - ring=true : 버튼 테두리를 그릴 때
export const EditCircleButton = ({ size = 35, ring = false, className, ...props }) => {
  return (
    <EditBtn
      type="button"
      className={className}
      $size={size}
      $ring={ring}
      aria-label="정보 수정"
      title="정보 수정"
      {...props}
    >
      <EditIcon />
    </EditBtn>
  );
};

const EditBtn = styled.button`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  padding: 0;
  border: ${({ $ring }) => ($ring ? "1.2px solid #e8512a" : "0")};
  background: ${({ $ring }) => ($ring ? "#fff" : "transparent")};
  border-radius: 50%;
  display: grid;
  place-items: center;
  cursor: pointer;

  svg { width: 46%; height: 46%; display: block; }
  svg [stroke] { stroke: #e8512a !important; }
  svg [fill]   { fill:   #e8512a !important; }

  &:focus-visible { outline: none; box-shadow: 0 0 0 3px #ff5a2f33; }
`;


// 프로필 사진 선택(카메라) 버튼
// 아이콘 SVG에 원이 포함되어 있으니 버튼은 투명/테두리 없음
// onPick(file) 콜백으로 선택 파일 전달
export const PhotoPickButton = ({ size = 32, onPick, className, ...props }) => {
  const inputRef = useRef(null);

  const openFile = () => inputRef.current?.click();
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file && onPick) onPick(file);
    e.target.value = ""; // 같은 파일 다시 선택할 때도 onChange 되도록 리셋
  };

  return (
    <>
      <PhotoBtn type="button" className={className} $size={size} onClick={openFile} {...props}>
        <CameraIcon />
      </PhotoBtn>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: "none" }}
      />
    </>
  );
};

const PhotoBtn = styled.button`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  padding: 0;
  border: 0;
  background: transparent;   /* ← 아이콘 자체의 원만 보이게 */
  display: grid;
  place-items: center;
  cursor: pointer;

  svg { width: 100%; height: 100%; display: block; }
`;
