// src/pages/Mypage/Mypage.jsx
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TitleBar from "../../components/TitleBar";
import Navar from "../../components/Navar";
import basicProfile from "../../assets/images/basic_profile.svg";
import { EditCircleButton } from "../../components/Button";
import mycoupon from "../../assets/images/mycoupon.svg?url";

// 유저 API
import { getUser } from "../../shared/api/user";

export default function Mypage() {
  const nav = useNavigate();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [myTags, setMyTags] = useState([]);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const me = await getUser(); 

        if (ignore) return;

        setNickname(me?.nickname ?? "");
        setEmail(me?.email ?? "");
        setAvatar(me?.imageUrl || null);

        // 해시태그: 서버가 주는 필드명 여러가지 대응
       const rawTags = me?.myHashtags ?? me?.hashtags ?? [];
       const names = Array.isArray(rawTags)
       ? rawTags
      .map((t) =>
        (t?.name ?? t?.tagName ?? t?.keyword ?? t?.title ?? (typeof t === "string" ? t : ""))
          .toString()
          .trim()
          .replace(/^#+/, "")
      )
      .filter(Boolean)
       : [];
      setMyTags(names);

      } catch (e) {
        // ❗ API 실패 시에만 예전 localStorage 폴백 사용 (더미 UI 방지)
        try {
          const saved = JSON.parse(localStorage.getItem("profile") || "null");
          if (saved) {
            setNickname(saved.nickname ?? "");
            setEmail(saved.email ?? "");
            setAvatar(saved.avatar ?? null);

            // 옛 로컬 포맷(인덱스만 저장) → 개수만큼 빈 태그명 생성 X
            // 실제 표시용 태그는 별도 저장되어 있었다면 그것만 사용
            const legacy = JSON.parse(localStorage.getItem("myTags") || "[]");
            if (Array.isArray(legacy) && legacy.length) {
              setMyTags(legacy.map(String));
            } else {
              setMyTags([]); // 더미(#해시태그)로 채우지 않음
            }
            return;
          }
        } catch (_) {}
        // 폴백도 없으면 빈 상태 유지
      }
    })();

    return () => {
      ignore = true;
    };
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

          <EditBtn size={80} onClick={() => nav("/mypage/edit")} />
        </Profile>

        {!!myTags.length && (
          <TagGrid>
            {myTags.map((t, i) => (
              <TagChip key={i}>#{t}</TagChip>
            ))}
          </TagGrid>
        )}

<TicketButton
  onClick={() => nav("/mypage/coupons")}
  aria-label="나의 쿠폰함 확인하기"
>
  내 쿠폰함 확인하기
</TicketButton>


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
  background: #faf8f8;
  overflow: hidden;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: #faf8f8;
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
  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
    display: none !important;
  }

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
  justify-items: start;
  margin-bottom: 15px;
`;

const Avatar = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 9999px;
  background: #fff9f2;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Info = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
  font-family: Pretendard;
`;

const Name = styled.div`
  color: #ce4927;
  font-size: 32px;
  font-weight: 700;
  line-height: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Email = styled.div`
  color: #9a9a9a;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EditBtn = styled(EditCircleButton)`
  margin-left: 12px;
  flex-shrink: 0;
  transform: translateX(+15px);

  outline: none;
  -webkit-tap-highlight-color: transparent;

  &:focus,
  &:focus-visible,
  &:active {
    outline: none;
    box-shadow: none;
  }
  &::-moz-focus-inner {
    border: 0;
  }
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
  background: #ec6541;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  font-family: Pretendard;
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
  text-align: left;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 48px;
  row-gap: 12px;
  align-items: start;
  text-align: left;
`;

const Col = styled.div`
  display: grid;
  gap: 12px;
  text-align: left;
`;

const Item = styled.div`
  color: #141414;
  font-size: 12px;
  font-family: Pretendard, system-ui, -apple-system, "Segoe UI", Roboto,
    "Noto Sans KR", sans-serif;
  font-weight: 500;
  line-height: 20px;
  text-align: left;
`;

const ItemSmall = styled(Item)``;

const TicketButton = styled.button`
  width: 100%;
  height: 130px;
  margin: 40px 0 20px;              
  background: url(${mycoupon}) center / 100% 100% no-repeat;
  border: 0;
  cursor: pointer;

  text-indent: -9999px;
  overflow: hidden;

  /* 포커스/탭 하이라이트 제거*/
  outline: none;
  -webkit-tap-highlight-color: transparent;
  &:focus { outline: none; }
`;

