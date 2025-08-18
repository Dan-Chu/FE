// src/pages/Mypage/EditProfile.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import TitleBar from "../../components/TitleBar";

import basicProfile from "../../assets/images/basic_profile.svg";
import { PhotoPickButton } from "../../components/Button";

export default function EditProfile() {
  const [nickname, setNickname] = useState("김단추");
  const [email] = useState("XXXXXX@skuniv.ac.kr");
  const [avatar, setAvatar] = useState(null);

  // 4x7 = 28개
  const TAG_COUNT = 28;
  const [selected, setSelected] = useState(
    Array.from({ length: TAG_COUNT }, () => false)
  );

  // 저장된 프로필 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("profile") || "null");
    if (!saved) return;
    setNickname(saved.nickname ?? "김단추");
    setAvatar(saved.avatar ?? null);
    if (Array.isArray(saved.selectedIndices)) {
      setSelected((prev) =>
        prev.map((_, i) => saved.selectedIndices.includes(i))
      );
    }
  }, []);

  const toggle = (i) =>
    setSelected((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const saveAll = () => {
    const selectedIndices = selected
      .map((v, i) => (v ? i : -1))
      .filter((i) => i >= 0);
    localStorage.setItem(
      "profile",
      JSON.stringify({ nickname, email, avatar, selectedIndices })
    );
    alert("저장 완료!");
  };

  return (
    <Center>
      <Wrap>
        <TitleBar pageName="내 정보" />

        {/* 카메라 버튼 */}
        <Head>
          <AvatarWrap>
            <Avatar src={avatar || basicProfile} alt="프로필" />
            <Camera
              size={32}
              onPick={(dataUrl) => setAvatar(dataUrl)}
            />
          </AvatarWrap>
        </Head>

        {/* 정보 카드 */}
        <Card>
          <Row>
            <FieldLabel>닉네임</FieldLabel>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
            />
          </Row>
          <Divider />
          <Row>
            <FieldLabel>이메일</FieldLabel>
            <ReadOnly>{email}</ReadOnly>
          </Row>
        </Card>

        <DottedHr />

        {/* 해시태그 4x7 (28개) */}
        <SectionTitle>마이 해시태그</SectionTitle>
        <TagGrid>
          {Array.from({ length: TAG_COUNT }).map((_, i) => (
            <TagBtn
              key={i}
              type="button"
              $on={selected[i]}
              aria-pressed={selected[i]}
              onClick={() => toggle(i)}
            >
              해시태그
            </TagBtn>
          ))}
        </TagGrid>

        {/* (옵션) 푸시 스위치 자리는 남겨두고 생략 */}

        <SaveButton onClick={saveAll}>변경 사항 한번에 저장하기</SaveButton>

        <FooterLinks>
          <a href="#logout">로그아웃</a>
          <span>|</span>
          <a href="#withdraw">회원탈퇴</a>
        </FooterLinks>
      </Wrap>
    </Center>
  );
}

/* ================= styled ================= */

const Center = styled.div`
  width: 100%;
  max-width: 390px;
  min-height: 100dvh;
  margin: 0 auto;
  background: #faf8f8;
  display: flex;
  flex-direction: column;
`;

const Wrap = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  padding: 0 24px 24px;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 0; height: 0; }
  scrollbar-width: none;
  -ms-overflow-style: none;

  padding-bottom: calc(24px + env(safe-area-inset-bottom));
`;

const Head = styled.div`
  display: flex;
  justify-content: center;
  margin: 24px 0 12px;
`;

const AvatarWrap = styled.div`
  position: relative;
  width: 84px;
  height: 84px;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: #fff9f2;
`;

/* 오버레이 카메라 버튼 위치 고정 */
const Camera = styled(PhotoPickButton)`
  position: absolute;
  right: -2px;
  bottom: -2px;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const FieldLabel = styled.div`
  width: 72px;
  color: #5d5d5d;
  font-weight: 600;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  &:focus {
    border-color: #ff5a2f;
    box-shadow: 0 0 0 3px #ff5a2f22;
  }
`;

const ReadOnly = styled.div`
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  background: #f6f7f7;
  color: #333;
  font-size: 15px;
`;

const Divider = styled.div`
  height: 1px;
  background: #efefef;
  margin: 14px 0;
`;

const DottedHr = styled.div`
  border-bottom: 1px dashed #e0e0e0;
  margin: 18px 0 12px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 18px;
  color: #141414;
  font-weight: 600;
`;

/* 해시태그 4열 그리드 */
const TagGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px 12px;
  margin-bottom: 18px;
`;

/* 토글 가능한 칩 형태 */
const TagBtn = styled.button`
  height: 31px;
  padding: 0 12px;
  border-radius: 18px;
  border: 1px solid #e8512a;
  background: ${({ $on }) => ($on ? "#EC6541" : "#fff")};
  color: ${({ $on }) => ($on ? "#fff" : "#e8512a")};
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px #ff5a2f33;
  }
`;

const SaveButton = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 16px;
  border: 0;
  border-radius: 12px;
  background: #cf4721;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
`;

const FooterLinks = styled.div`
  margin-top: 14px;
  display: flex;
  gap: 10px;
  justify-content: center;
  color: #9b9b9b;
  & a { color: inherit; text-decoration: none; }
`;
