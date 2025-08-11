import styled from "styled-components";
import Logo from "../../assets/logos/logo.svg?react";
import Kakao from "../../assets/icons/icon_kakao.svg?react"
import Google from "../../assets/icons/icon_google.svg?react"
import Naver from "../../assets/icons/icon_naver.svg?react"
import Apple from "../../assets/icons/icon_apple.svg?react"
import { useNavigate } from "react-router-dom";

export default function Login1() {
  const navigate=useNavigate();

  const login=()=>{
    navigate("/main");
  }

  return (
    <Page>
      <Logo />
      <Text>
        <span style={{ color: "#CE4927" }}>단추</span>에<br />잘 오셨어요!
      </Text>
      <Group>
        <MethodCard backColor="#FDE402" color="#000">
          <Kakao/>카카오 계정으로 1초 만에 시작하기
        </MethodCard>
        <MethodCard
          backColor="#FFF"
          borderLine="1px solid #DCDCDC"
          color="#000"
        >
          <Google/>구글 계정으로 시작하기
        </MethodCard>
        <MethodCard backColor="#03CE5C;" color="#FAF8F8">
          <Naver/>네이버 계정으로 시작하기
        </MethodCard>
        <MethodCard backColor="#000" color="#FAF8F8">
          <Apple/>애플 계정으로 시작하기
        </MethodCard>
      </Group>
      <Test onClick={()=>login()}>테스트 계정으로 로그인</Test>
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding-left: 23px;
  padding-top: 46px;
`;
const Text = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: 38px;
  letter-spacing: -1px;
  margin-right: auto;
  text-align: left;
`;
const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  margin-top: 54px;
  margin-bottom: 38px;
`;
const MethodCard = styled.div`
  display: flex;
  width: 344px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 12px;
  background-color: ${({ backColor }) => backColor};
  border: ${({ borderLine }) => borderLine};
  align-items: center;
  justify-content: center;
  gap: 15px;

  color: ${({ color }) => color};
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.16px;

    &:hover{
    cursor: pointer;
  }
`;
const Test = styled.div`
  color: #6a6a6a;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;

  &:hover{
    cursor: pointer;
  }
`;
