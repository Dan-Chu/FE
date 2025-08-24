// src/pages/Mypage/EditProfile.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import TitleBar from "../../components/TitleBar";
import { useNavigate } from "react-router-dom";
import BackIcon from "../../assets/icons/back_mypage.svg?react";
import PushOn from "../../assets/icons/push_on.svg?react";
import PushOff from "../../assets/icons/push_off.svg?react";

import basicProfile from "../../assets/images/basic_profile.svg";
import { PhotoPickButton } from "../../components/Button";

// API
import {
  getUser,
  updateUser,
  logout as apiLogout,
  deleteUser as apiDeleteUser,
} from "../../shared/api/user";
import { HashtagsGet } from "../../shared/api/hashtag";

export default function EditProfile() {
  const nav = useNavigate();

  // 프로필 기본 정보
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // 아바타(미리보기 / 파일)
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  // 해시태그
  const allTags = HashtagsGet(); // [{id, name, ...}]
  const [selected, setSelected] = useState(new Set()); // 선택된 태그 id 집합

  // 알림 동의
  const [push, setPush] = useState(
    localStorage.getItem("push") === "true" // 최초에 localStorage에서 불러오기
  );
  useEffect(() => {
    localStorage.setItem("push", push);
  }, [push]);

  // dataURL → File
  const dataURLtoFile = (dataUrl, filename = "avatar.png") => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8 = new Uint8Array(n);
    while (n--) u8[n] = bstr.charCodeAt(n);
    return new File([u8], filename, { type: mime });
  };

  // 최초 로드: 내 정보 가져오기
  useEffect(() => {
    (async () => {
      try {
        const me = await getUser();
        setNickname(me?.nickname ?? "");
        setEmail(me?.email ?? "");
        setAvatarPreview(me?.imageUrl ?? "");

        const mine = me?.myHashtags ?? me?.hashtags ?? [];
        setSelected(new Set(mine.map((t) => t.id)));
      } catch (e) {
        alert("내 정보를 불러오지 못했어요.");
        console.error(e);
      }
    })();
  }, []);

  const toggleTag = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // 이메일 입력/검증
  const onChangeEmail = (e) => {
    const v = e.target.value;
    setEmail(v);
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    setEmailError(ok || v === "" ? "" : "이메일 형식이 올바르지 않습니다.");
  };

  // 저장: multipart/form-data (userRequest JSON + imageFile)
  const saveAll = async () => {
    try {
      if (!email) return alert("이메일을 입력해주세요.");
      if (emailError) return alert("이메일 형식을 확인해주세요.");

      // 1) 선택된 id -> 태그 이름으로 변환
      const chosen = allTags.filter((t) => selected.has(t.id ?? t.hashtagId));
      const hashtagsPayload = chosen
        .map((t) => (t.name ?? t.title ?? t.hashtag ?? "").trim())
        .filter(Boolean)
        .map((name) => ({ name })); // [{ name: "단짠단짠" }]

      // 2) 스웨거 스펙대로 userRequest 구성
      const userRequest = {
        nickname,
        email,
        hashtags: hashtagsPayload,
      };

      const fd = new FormData();
      fd.append(
        "userRequest",
        new Blob([JSON.stringify(userRequest)], { type: "application/json" })
      );
      if (avatarFile) fd.append("imageFile", avatarFile);

      await updateUser(fd);

      // 마이페이지가 새로 마운트되도록 이동 → 최신 이메일 바로 반영
      alert("저장 완료!");
      nav("/mypage", { replace: true });
    } catch (e) {
      console.log("PUT /users error:", e?.response?.status, e?.response?.data);
      alert(
        e?.response?.data?.message ??
          `저장 실패 (${e?.response?.status ?? "네트워크"})`
      );
    }
  };

  // 로그아웃/탈퇴
  const onLogout = async (ev) => {
    ev.preventDefault();
    try {
      await apiLogout();
      localStorage.removeItem("accessToken");
      alert("로그아웃 되었습니다.");
      nav("/login1");
    } catch (e) {
      console.error(e);
      alert("로그아웃 실패");
    }
  };

  const onWithdraw = async (ev) => {
    ev.preventDefault();
    if (!confirm("정말 탈퇴하시겠어요?")) return;
    try {
      await apiDeleteUser();
      localStorage.removeItem("accessToken");
      alert("회원탈퇴가 완료되었습니다.");
      nav("/login1");
    } catch (e) {
      console.error(e);
      alert("회원탈퇴에 실패했습니다.");
    }
  };

  return (
    <Center>
      <Wrap>
        <BackFloat onClick={() => nav(-1)} aria-label="뒤로가기">
          <BackIcon />
        </BackFloat>
        <TitleBar pageName="내 정보" centered hideLogo />

        <ScrollArea>
        <Head>
          <AvatarWrap>
            <Avatar
              src={avatarPreview || basicProfile}
              alt="프로필"
              onError={(e) => (e.currentTarget.src = basicProfile)}
            />
            <Camera
              size={32}
              onPick={(dataUrl) => {
                setAvatarPreview(dataUrl);
                try {
                  setAvatarFile(dataURLtoFile(dataUrl));
                } catch (e) {
                  if (import.meta.env.DEV)
                    console.debug("dataURL->File 변환 실패", e);
                }
              }}
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
            <Input
              type="email"
              value={email}
              onChange={onChangeEmail}
              placeholder="이메일을 입력하세요"
              autoComplete="email"
              inputMode="email"
              aria-invalid={!!emailError}
            />
          </Row>
          {emailError && <HelperError>{emailError}</HelperError>}
        </Card>

        <DottedHr />

        {/* 해시태그 */}
        <SectionTitle>마이 해시태그</SectionTitle>
        <TagGrid>
          {allTags.map((t) => {
            const id = t.id ?? t.hashtagId;
            const name = (t.name ?? t.title ?? t.hashtag ?? "")
              .trim()
              .replace(/^#+/, "");
            const active = selected.has(id);
            return (
              <TagBtn
                key={id}
                type="button"
                $on={active}
                aria-pressed={active}
                onClick={() => toggleTag(id)}
              >
                #{name}
              </TagBtn>
            );
          })}
          {allTags.length === 0 && <Empty>해시태그가 없습니다.</Empty>}
        </TagGrid>

        <PushBox>
          푸시성 알림 동의
          {push ? (
            <PushOn onClick={() => setPush(false)} />
          ) : (
            <PushOff onClick={() => setPush(true)} />
          )}
        </PushBox>
        </ScrollArea>

        <SaveButton onClick={saveAll} disabled={!email || !!emailError}>
          변경 사항 한번에 저장하기
        </SaveButton>

        {/* 하단 링크 */}
        <FooterLinks>
          <a href="#logout" onClick={onLogout}>
            로그아웃
          </a>
          <span>|</span>
          <a href="#withdraw" onClick={onWithdraw}>
            회원탈퇴
          </a>
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
  padding: 0 24px 0;
  overflow-y: auto;
  height: 100%;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const Head = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0 12px;
`;

const BackFloat = styled.button`
  position: absolute;
  left: -20px;
  top: 4px;
  width: 100px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;

  &:focus,
  &:focus-visible,
  &:active {
    outline: none;
    box-shadow: none;
  }
  &::-moz-focus-inner {
    border: 0;
  }
  svg {
    width: 20px;
    height: 20px;
  }
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

const Camera = styled(PhotoPickButton)`
  position: absolute;
  right: -2px;
  bottom: -2px;
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
  width: 52px;
  color: #5d5d5d;
  font-weight: 600;
  font-family: Pretendard;
`;

const Input = styled.input`
  flex: 1;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  font-family: Pretendard;
  &:focus {
    border-color: #ff5a2f;
    box-shadow: 0 0 0 3px #ff5a2f22;
  }
`;

const HelperError = styled.div`
  color: #e7502a;
  font-size: 12px;
  margin: 6px 0 0 86px; /* 라벨(72px)+gap(14px) 정렬 */
`;

const Divider = styled.div`
  height: 1px;
  background: #efefef;
  margin: 14px 0;
`;

const DottedHr = styled.div`
  border-bottom: 1px dashed #e0e0e0;
  margin: 28px 0 22px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 18px;
  color: #141414;
  font-weight: 600;
  font-family: Pretendard;
  text-align: left;
`;

const TagGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 13px 10px;
  grid-auto-rows: 31px;
  height: 300px;
`;

const TagBtn = styled.button`
  height: 31px;
  padding: 0 12px;
  border-radius: 18px;
  border: 1px solid #e8512a;
  background: ${({ $on }) => ($on ? "#EC6541" : "#fff")};
  color: ${({ $on }) => ($on ? "#fff" : "#e8512a")};
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: Pretendard;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px #ff5a2f33;
  }
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

const Empty = styled.div`
  grid-column: 1 / -1;
  font-size: 12px;
  color: #888;
`;

const SaveButton = styled.button`
  width: 100%;
  height: 50px;
  margin-top: 5px;
  margin-bottom: 16px;
  border: 0;
  border-radius: 12px;
  background: #cf4721;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  font-family: Pretendard;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

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

const FooterLinks = styled.div`
  position: sticky;
  bottom: calc(8px + env(safe-area-inset-bottom));
  background: #faf8f8;
  padding: 8px 0 10px;
  z-index: 10;
  display: flex;
  gap: 10px;
  justify-content: center;
  color: #9b9b9b;
  font-size: 12px;
  & a {
    color: inherit;
    text-decoration: none;
  }
`;

const PushBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  margin-bottom: 30px;

  color: #141414;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 125% */
  letter-spacing: -1px;
`;
const ScrollArea = styled.div`
height: calc(100dvh - 200px);
  overflow-x: hidden;
  overflow-y: auto;
  white-space: nowrap;
  scrollbar-width: none; /* Firefox */
`;
