import styled from "styled-components";
import Logo from "../../assets/logos/logo.svg?react";
import Kakao from "../../assets/icons/icon_kakao.svg?react";
import Google from "../../assets/icons/icon_google.svg?react";
import Naver from "../../assets/icons/icon_naver.svg?react";
import Apple from "../../assets/icons/icon_apple.svg?react";
import { useNavigate } from "react-router-dom";
import { TestLogin } from "../../shared/api/auth";
import { useState } from "react";

export default function Login1() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);

  const login = async () => {
    const success = await TestLogin(); // 로그인 완료를 기다림
    if (success) {
      navigate("/login2");
    } else {
      alert("로그인 실패");
    }
  };

  const modalOnOff = () => {
    setModal(!modal);
  };

  return (
    <Page>
      <Logo />
      <Text>
        <span style={{ color: "#CE4927" }}>단추</span>에<br />잘 오셨어요!
      </Text>
      {modal && (
        <Modal>
        <NotYet>
          <ModalText>개발 중인 기능입니다.<br/>
          <span style={{fontSize:"14px"}}>테스트 계정으로 로그인해주세요.</span>
          </ModalText>
          <Close onClick={() => modalOnOff()}>닫기</Close>
        </NotYet>
        </Modal>
      )}
      <Group>
        <MethodCard
          $backColor="#FDE402"
          $color="#000"
          onClick={() => modalOnOff()}
        >
          <Kakao />
          카카오 계정으로 1초 만에 시작하기
        </MethodCard>
        <MethodCard
          $backColor="#FFF"
          $borderLine="1px solid #DCDCDC"
          $color="#000"
          onClick={() => modalOnOff()}
        >
          <Google />
          구글 계정으로 시작하기
        </MethodCard>
        <MethodCard
          $backColor="#03CE5C;"
          $color="#FAF8F8"
          onClick={() => modalOnOff()}
        >
          <Naver />
          네이버 계정으로 시작하기
        </MethodCard>
        <MethodCard
          $backColor="#000"
          $color="#FAF8F8"
          onClick={() => modalOnOff()}
        >
          <Apple />
          애플 계정으로 시작하기
        </MethodCard>
      </Group>
      <Test onClick={() => login()}>테스트 계정으로 로그인</Test>
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  height: 100%;
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
  background-color: ${({ $backColor }) => $backColor};
  border: ${({ $borderLine }) => $borderLine};
  align-items: center;
  justify-content: center;
  gap: 15px;

  color: ${({ $color }) => $color};
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.16px;

  &:hover {
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

  &:hover {
    cursor: pointer;
  }
`;
const NotYet = styled.div`
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 1000;
  width: 345px;
  height: 244px;
  flex-shrink: 0;
  border-radius: 12px;
  
  background: #fff;
`;
const ModalText = styled.div`
  flex: 1; /* 남는 공간을 차지 */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;

  color: #5d5d5d;
  text-align: center;
  font-family: Pretendard;
  font-size: 26px;
  font-style: normal;
  font-weight: 500;
  line-height: 40px; /* 115.385% */
  letter-spacing: -1px;
`;
const Close = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 344px;
  height: 46px;
  border-radius: 0 0 12px 12px;
  border: 1px solid #ce4927;
  background: #ce4927;
  margin-top: auto;

  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 30px; /* 187.5% */
  letter-spacing: -1px;

  &:hover {
    cursor: pointer;
  }
`;
export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;
