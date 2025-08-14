// src/pages/Mypage/EditProfile.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import TitleBar from "../../components/TitleBar";

import basicProfile from "../../assets/images/basic_profile.svg";
// 연필 아이콘은 제거
import tagOn from "../../assets/images/Hashtag_yes.svg";  // 빨강 채움
import tagOff from "../../assets/images/Hashtag_no.svg";  // 빨간 테두리/흰 배경

export default function EditProfile() {
  const [nickname, setNickname] = useState("김단추");
  const [email] = useState("XXXXXX@skuniv.ac.kr");

  const labels = Array.from({ length: 12 }, (_, i) => `해시태그${i + 1}`);
  const [tags, setTags] = useState(labels.map((label) => ({ label, on: false })));
  const [pushOn, setPushOn] = useState(true);

  // 저장된 프로필 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("profile") || "null");
    if (!saved) return;
    setNickname(saved.nickname ?? "김단추");
    setPushOn(!!saved.pushOn);
    if (Array.isArray(saved.selectedLabels)) {
      setTags((prev) =>
        prev.map((t) => ({ ...t, on: saved.selectedLabels.includes(t.label) }))
      );
    }
  }, []);

  const toggleTag = (i) =>
    setTags((prev) => prev.map((t, idx) => (idx === i ? { ...t, on: !t.on } : t)));

  const saveAll = () => {
    const selectedLabels = tags.filter((t) => t.on).map((t) => t.label);
    localStorage.setItem(
      "profile",
      JSON.stringify({ nickname, pushOn, selectedLabels })
    );
    alert("저장 완료!");
  };

  return (
    <Wrap>
      <TitleBar title="내 정보" />

      <Header>
        <Avatar src={basicProfile} alt="프로필 이미지" />
        {/* 연필 아이콘 삭제 */}
      </Header>

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

      <SectionTitle>마이 해시태그</SectionTitle>
      <TagGrid>
        {tags.map((t, i) => (
          <TagButton
            key={t.label}
            type="button"
            $on={t.on}
            onClick={() => toggleTag(i)}
            aria-pressed={t.on}
            aria-label={t.label}
            title={t.label}
          >
            <Hidden>{t.label}</Hidden>
          </TagButton>
        ))}
      </TagGrid>

      <PushRow>
        <PushLabel>푸시성 알림 동의</PushLabel>
        <Switch role="switch" aria-checked={pushOn} onClick={() => setPushOn((v) => !v)} $on={pushOn}>
          <Knob $on={pushOn} />
        </Switch>
      </PushRow>

      <SaveButton onClick={saveAll}>변경 사항 한번에 저장하기</SaveButton>

      <FooterLinks>
        <a href="#logout">로그아웃</a>
        <span>|</span>
        <a href="#withdraw">회원탈퇴</a>
      </FooterLinks>
    </Wrap>
  );
}

/* ================= styled ================= */

const Wrap = styled.div`
  padding: 0 20px 40px;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  margin: 28px 0 12px;
`;

const Avatar = styled.img`
  width: 84px;
  height: 84px;
  border-radius: 50%;
  object-fit: cover;
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

const SectionTitle = styled.h3`
  margin: 26px 0 12px;
  font-size: 18px;
`;

/* ---- 해시태그 버튼 (이미지 기반) ---- */
const TagGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px 12px;
  margin-bottom: 18px;
`;

const TagButton = styled.button`
  /* 기본 버튼 스타일 제거 */
  border: 0;
  background: transparent;
  padding: 0;
  outline: none;
  cursor: pointer;

  width: 88px;      /* 이미지 비율에 맞게 조정 */
  height: 36px;
  background-image: url(${(p) => (p.$on ? tagOn : tagOff)});
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 999px; /* 포커스/클릭 영역 부드럽게 */

  &:focus-visible {
    box-shadow: 0 0 0 3px #ff5a2f33;
  }
`;

const Hidden = styled.span`
  position: absolute;
  width: 1px; height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
`;

const PushRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 18px 0 6px;
`;

const PushLabel = styled.div`
  font-weight: 600;
`;

const Switch = styled.button`
  width: 54px;
  height: 30px;
  border: 0;
  border-radius: 999px;
  background: ${(p) => (p.$on ? "#ff5a2f" : "#e5e5e5")};
  position: relative;
  cursor: pointer;
  padding: 0;
`;

const Knob = styled.span`
  position: absolute;
  top: 3px;
  left: ${(p) => (p.$on ? "27px" : "3px")};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  transition: left 0.18s ease;
`;

const SaveButton = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 16px;
  border: 0;
  border-radius: 12px;
  background: #e4552f;
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
