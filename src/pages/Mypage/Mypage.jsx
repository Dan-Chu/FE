// src/pages/Mypage/Mypage.jsx
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TitleBar from "../../components/TitleBar";

import tagOn from "../../assets/images/Hashtag_yes.svg";
import basicProfile from "../../assets/images/basic_profile.svg";
import editIcon from "../../assets/icons/edit.svg";        // ✅ 배경 이미지 import
import Navar from "../../components/Navar";

export default function Mypage() {
  const nav = useNavigate();
  const [myTags, setMyTags] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("myTags") || "[]");
    setMyTags(saved.slice(0, 8));
  }, []);

  return (
    <Center>
      <Wrap>
        <TitleBar pageName="마이페이지" />

        <Header>
          <Avatar><img src={basicProfile} alt="" /></Avatar>
          <Name>김단추</Name>
          <Email>XXXXXX@skuniv.ac.kr</Email>
          <EditBtn onClick={() => nav("/mypage/edit")} aria-label="정보 수정" />
        </Header>

        <TagWrap>
          {myTags.map((t, i) => (
            <Tag key={i}>{t}</Tag>
          ))}
        </TagWrap>

        <CouponStrip>
          <Left>나의 쿠폰함</Left>
          <Right onClick={() => nav("/mypage/coupons")}>확인하기</Right>
        </CouponStrip>

        <Hr />

        <BlockTitle>문의 및 알림</BlockTitle>
        <TwoCol>
          <Col>
            <Item>고객센터</Item>
            <Item>공지사항</Item>
            <ItemSm>현재 버전 1.0.0</ItemSm>
          </Col>
          <Col>
            <Item>자주 묻는 질문</Item>
            <Item>약관 및 정책</Item>
          </Col>
        </TwoCol>
      </Wrap>

      {/* ✅ 여기! 고정 네비게이션 렌더 */}
      <Navar />
    </Center>
  );
}

/* ===== styles ===== */

const Center = styled.div`
  width: 100vw;
  min-height: 100svh;
  display: flex;
  justify-content: center;
  background: #faf8f8;

  /* ⚠️ fixed 요소가 잘리는 원인이라면 아래 속성들이 있으면 지우세요
     overflow: hidden; transform: translateZ(0); filter: ...; */
`;

const Wrap = styled.div`
  width: 100%;
  max-width: 480px;                       /* Navar의 max-width와 맞추면 좋아요 */
  min-height: 100vh;
  box-sizing: border-box;
  background: #faf8f8;
  padding: 16px;
  padding-bottom: calc(90px + env(safe-area-inset-bottom)); /* 바텀 네비 여백 */
  margin: 0 auto;
`;

/* 상단 */
const Header = styled.div`
  position: relative;
  padding-top: 6px;
  margin-bottom: 10px;
`;
const Avatar = styled.div`
  width: 70px; height: 70px; border-radius: 9999px;
  background: #fff9f2; overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;
const Name = styled.div`
  margin-top: 12px; color: #ce4927; font-size: 32px; font-weight: 700; line-height: 30px;
`;
const Email = styled.div`
  margin-top: 8px; color: #9a9a9a; font-size: 14px; font-weight: 500;
`;
const EditBtn = styled.button`
  position: absolute; right: 6px; top: 8px;
  width: 35px; height: 35px; border-radius: 50%;
  border: 1.2px solid #e8512a;
  background: #fff url(${editIcon}) center/16px no-repeat;   /* ✅ */
  cursor: pointer;
`;

/* 태그 */
const TagWrap = styled.div`
  display: flex; flex-wrap: wrap; gap: 10px 12px; margin: 14px 0 10px;
`;
const Tag = styled.div`
  width: 75px; height: 31px; border-radius: 18px;
  background: url(${tagOn}) center/cover no-repeat;
  display: grid; place-items: center;
  color: #fff; font-size: 11px; font-weight: 500;
`;

/* 쿠폰 스트립 */
const CouponStrip = styled.div`
  display: flex; align-items: stretch; width: 100%; height: 130px;
  border-radius: 12px; overflow: hidden; background: #ffedd6;
  margin: 6px 0 12px;
`;
const Left = styled.div`
  flex: 1; display: flex; align-items: center; padding-left: 18px;
  color: #141414; font-size: 24px; font-weight: 600;
`;
const Right = styled.button`
  width: 120px; border: 0; background: #cf4721; color: #fff;
  font-size: 14px; font-weight: 500; cursor: pointer; position: relative;
  &:after {
    content: ""; position: absolute; left: -12px; top: 50%; transform: translateY(-50%);
    width: 12px; height: 24px; background: #ffedd6; border-radius: 0 12px 12px 0;
  }
`;

/* 하단 정보 */
const Hr = styled.div`height: 1px; background: #d9d9d9; margin: 10px 0 12px;`;
const BlockTitle = styled.div`color: #5d5d5d; font-size: 14px; font-weight: 600; margin-bottom: 10px;`;
const TwoCol = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 4px 30px;`;
const Col = styled.div`display: grid; gap: 10px;`;
const Item = styled.div`color: #141414; font-size: 13px; font-weight: 500;`;
const ItemSm = styled.div`color: #141414; font-size: 13px;`;
