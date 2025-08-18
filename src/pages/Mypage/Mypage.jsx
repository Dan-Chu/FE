import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TitleBar from "../../components/TitleBar";
import Navar from "../../components/Navar";
import basicProfile from "../../assets/images/basic_profile.svg";
import { EditCircleButton } from "../../components/Button";

export default function Mypage() {
  const nav = useNavigate();

  const [nickname, setNickname] = useState("김단추");
  const [email, setEmail] = useState("XXXXXX@skuniv.ac.kr");
  const [avatar, setAvatar] = useState(null);
  const [myTags, setMyTags] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("profile") || "null");
    if (saved) {
      setNickname(saved.nickname ?? "김단추");
      setEmail(saved.email ?? "XXXXXX@skuniv.ac.kr");
      setAvatar(saved.avatar ?? null);

      if (Array.isArray(saved.selectedIndices)) {
        const count = saved.selectedIndices.length;
        setMyTags(Array.from({ length: count }, () => "해시태그"));
        return;
      }
    }
    const legacy = JSON.parse(localStorage.getItem("myTags") || "[]");
    if (Array.isArray(legacy) && legacy.length) setMyTags(legacy);
  }, []);

  return (
    <Page>
      <Header>
        <TitleBar pageName="마이페이지" />
      </Header>

      <ScrollArea>
        <Profile>
          <Avatar>
            <img src={avatar || basicProfile} alt="" />
          </Avatar>

          <Info>
            <Name>{nickname}</Name>
            <Email>{email}</Email>
          </Info>

          <EditBtn size={70} onClick={() => nav("/mypage/edit")} />
        </Profile>

        {!!myTags.length && (
          <TagGrid>
            {myTags.map((t, i) => (
              <TagChip key={i}>#{t}</TagChip>
            ))}
          </TagGrid>
        )}

        <CouponCard>
          <CouponTitle>나의 쿠폰함</CouponTitle>
          <CouponCTA type="button" onClick={() => nav("/mypage/coupons")}>
            확인하기
          </CouponCTA>
        </CouponCard>

        <Divider />

        <SectionTitle>문의 및 알림</SectionTitle>
        <TwoCol>
          <Col>
            <Item>고객센터</Item>
            <Item>공지사항</Item>
            <ItemSmall>현재 버전 1.0.0</ItemSmall>
          </Col>
          <Col>
            <Item>자주 묻는 질문</Item>
            <Item>약관 및 정책</Item>
          </Col>
        </TwoCol>
      </ScrollArea>

      <Navar />
    </Page>
  );
}

/* ========= styled ========= */
const Page = styled.div`
  width: 100%;
  max-width: 390px;
  height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: #FAF8F8;
  overflow: hidden;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: #FAF8F8;
  box-shadow: none;
`;

const ScrollArea = styled.div`
  flex: 1 1 auto;
  min-height: 0;

  overflow-y: auto;
  overflow-x: hidden;

  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  padding: 0 24px calc(90px + env(safe-area-inset-bottom));

  /* 스크롤바 숨김 */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar{ width:0!important; height:0!important; display:none!important; }

  /* 오버레이 스크롤바 마스킹 */
  --sbw: 14px;
  margin-right: calc(var(--sbw) * -1);
  padding-right: calc(24px + var(--sbw));
`;

const Profile = styled.div`
  display: grid;
  grid-template-columns: 70px 1fr auto;
  align-items: center;
  column-gap: 12px;
  padding: 8px 0 14px;
`;

const Avatar = styled.div`
  width: 70px; height: 70px; border-radius: 9999px;
  background: #fff9f2; overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const Info = styled.div`
  min-width: 0; display: flex; flex-direction: column; gap: 6px;
`;

const Name = styled.div`
  color: #ce4927; font-size: 32px; font-weight: 700; line-height: 30px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

const Email = styled.div`
  color: #9a9a9a; font-size: 14px; font-weight: 500;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

const EditBtn = styled(EditCircleButton)`
  margin-left: 12px; flex-shrink: 0;
`;

/* 해시태그 – 4열 그리드 */
const TagGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px 12px;
  margin: 6px 0 12px;
`;

const TagChip = styled.div`
  height: 31px;
  padding: 0 12px;
  border-radius: 18px;
  background: #EC6541;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
`;

const CouponCard = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 130px;
  border-radius: 12px;
  overflow: hidden;
  background: #ffedd6;
  margin: 16px 0 22px;
`;

const CouponTitle = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 18px;
  color: #141414;
  font-size: 24px;
  font-weight: 600;
`;

const CouponCTA = styled.button`
  width: 120px;
  border: 0;
  background: #cf4721;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    left: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px; height: 24px;
    background: #ffedd6;
    border-radius: 0 12px 12px 0;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #e6e6e6;
  margin: 8px 0 18px;
`;

const SectionTitle = styled.div`
  color: #5d5d5d;
  font-size: 14px;
  font-family: Pretendard, system-ui, -apple-system, "Segoe UI", Roboto,
    "Noto Sans KR", sans-serif;
  font-weight: 500;
  margin-bottom: 12px;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 48px;
  row-gap: 12px;
  align-items: start;
`;

const Col = styled.div`
  display: grid;
  gap: 12px;
`;

const Item = styled.div`
  color: #141414;
  font-size: 12px;
  font-family: Pretendard, system-ui, -apple-system, "Segoe UI", Roboto,
    "Noto Sans KR", sans-serif;
  font-weight: 500;
  line-height: 20px;
`;

const ItemSmall = styled(Item)``;
