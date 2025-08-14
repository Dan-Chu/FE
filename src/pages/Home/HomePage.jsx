import styled from "styled-components";
import Navar from "../../components/Navar";

export default function HomePage() {
  return (
    <Wrap>
      홈페이지
      <Navar />
    </Wrap>
  );
}

const Wrap = styled.div`
  min-height: 100vh;
  padding: 24px 16px;
  /* 바텀 네비 높이만큼 여백 */
  padding-bottom: calc(90px + env(safe-area-inset-bottom));
  background: #fff;
`;
