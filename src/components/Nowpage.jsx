import styled from "styled-components";
import Logo from "../assets/logos/logo.svg?react";

export default function Nowpage({ pageName }) {
  return (
    <Header>
      <Logo width="35px" height="33px" />
      {pageName}
    </Header>
  );
}

const Header = styled.header`
  display: flex;
  justify-content: flex-start;
  gap: 15px;
  height: 38px;
  margin-left: 24px;

  color: #141414;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 30px; /* 125% */
  letter-spacing: -1px;
`;
