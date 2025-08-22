import styled from "styled-components";
import MapLogo from "../../assets/logos/login2_logo.svg?react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login2() {
  const navigate=useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/main");
    }, 2000); // 2초 후 사라짐
    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [navigate]);

  return (
    <Page>
      <TextBox>
        <Text1>
          <DotText>성</DotText>
          <span style={{ color: "#CE4927" }}>북구</span>의 숨은 맛집,
        </Text1>
        <Text2>
          <span style={{ color: "#CE4927" }}>단추</span>가<br />
          찾아줄게요!
        </Text2>
      </TextBox>
      <MapLogo />
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 143px;
  height: 100%;
`;
const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 48px;
  gap: 17px;
`;
const Text1 = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px;
  letter-spacing: -1px;
`;
const DotText = styled.span`
  position: relative;
  display: inline-block;
  color: #ce4927;

  &::before {
    content: "";
    position: absolute;
    top: -1px; /* 점의 높이 조절 */
    left: 9px;
    transform: translateX(-50%);
    width: 6px; /* 점의 크기 */
    height: 6px;
    background-color: #ce4927; /* 점 색상 */
    border-radius: 50%; /* 원형 점 */
  }
`;
const Text2 = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 52px;
  font-style: normal;
  font-weight: 400;
  line-height: 61px;
  letter-spacing: -1px;
`;
