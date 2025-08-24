// src/components/TitleBar.jsx
import styled from "styled-components";
import Logo from "../assets/logos/logo.svg?react";

/**
 * 사용법 예시
 *  - 기본(로고 + 좌측정렬): <TitleBar pageName="마이페이지" />
 *  - 중앙정렬 + 로고 숨김:   <TitleBar pageName="내 정보" centered hideLogo />
 */

export default function TitleBar({
  pageName,
  centered = false,   
  hideLogo = false,   
}) {
  return (
    <Bar>
      {/* 왼쪽 영역 (로고/여백) */}
      <Left>
        {!hideLogo && <Logo width="35px" height="33px" />}
        {!centered && <TitleLeft>{pageName}</TitleLeft>}
      </Left>

      {/* 중앙 타이틀 (centered=true 일 때만 표시) */}
      {centered && <TitleCenter>{pageName}</TitleCenter>}

      {/* 오른쪽 영역(비워서 중앙 정확히 맞춤) */}
      <Right />
    </Bar>
  );
}

/* ===== styles ===== */
const Bar = styled.header`
  height: 41px;
  padding: 0 24px;
  padding-bottom: 15px;
  display: grid;
  grid-template-columns: 1fr auto 1fr; /* 가운데 타이틀 중앙 */
  align-items: center;

  color: #141414;
  font-family: Pretendard, system-ui, sans-serif;
  letter-spacing: -1px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  justify-self: start;
`;

const Right = styled.div`
  justify-self: end;
`;

const TitleBase = styled.div`
  font-size: 24px;
  font-weight: 600;
  line-height: 30px; /* 125% */
`;

const TitleLeft = styled(TitleBase)`
  text-align: left;
`;

const TitleCenter = styled(TitleBase)`
  text-align: center;
`;
