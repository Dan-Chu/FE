// src/pages/Mission/MissionPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TitleBar from "../../components/TitleBar";
import MainMissionCard from "../../components/MainMissionCard";
import {
  MissionModal,
  CodeInputModal,
  CouponSuccessModal,
} from "../../components/Modal";
import { AiMissionGet } from "../../shared/api/openAI";
import { MissionListGet, MissionDetailGet } from "../../shared/api/mission";
import { getUser, CompleteMissionGet } from "../../shared/api/user";
import FlagLogo from "../../assets/logos/flag_logo.svg?react";
import Loading from "../../components/Loading";

export default function MissionPage() {
  const navigate = useNavigate();

  const [isMissionOpen, setIsMissionOpen] = useState(false);
  const [isCodeInputOpen, setIsCodeInputOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [aiMissionData, setAiMissionData] = useState();
  const [missionData, setMissionData] = useState();
  const [missionDetailData, setMissionDetailData] = useState();

  const [completeMission, setCompleteMission] = useState(0);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState("");

  // 상세에서 보상만 모아두는 맵 { [id]: rewardName }
  const [rewardById, setRewardById] = useState({});

  // 바깥 스크롤 잠금
  useEffect(() => {
    document.body.classList.add("no-body-scroll");
    return () => document.body.classList.remove("no-body-scroll");
  }, []);

  // 상세 응답에서 보상 텍스트 정규화
  const normalizeRewardName = (detail) =>
    detail?.rewardName ??
    detail?.reward ??
    detail?.rewardText ??
    detail?.description ??
    "";

  // 상세 응답에서 가게명 / 인증코드 추출 (키 유연 대응)
  const getStoreName = (detail) =>
    detail?.storeName ?? detail?.store?.name ?? detail?.store_title ?? "";
  const getAuthCode = (detail) =>
    detail?.storeAuthCode ??
    detail?.authCode ??
    detail?.store?.authCode ??
    detail?.store_auth_code ??
    "";

  // 여러 개 id에 대해 상세 호출해서 보상만 채우기
  const fetchRewards = async (ids = []) => {
    if (!ids?.length) return;
    const results = await Promise.all(
      ids.map((id) => MissionDetailGet(id).catch(() => null))
    );
    const next = {};
    results.forEach((detail, i) => {
      const id = ids[i];
      if (detail) next[id] = normalizeRewardName(detail);
    });
    setRewardById((prev) => ({ ...prev, ...next }));
  };

  // 데이터 로드
  const getData = async () => {
    setLoading(true);
    try {
      // 병렬 로드로 초기 렌더 빠르게
      const [ai, list, count, user] = await Promise.allSettled([
        AiMissionGet(),
        MissionListGet(),
        CompleteMissionGet(),
        getUser(),
      ]);

      if (ai.status === "fulfilled") {
        setAiMissionData(ai.value);
        if (ai.value?.missionId) fetchRewards([ai.value.missionId]); // AI 카드 보상 채우기
      }

      if (list.status === "fulfilled") {
        setMissionData(list.value);
        fetchRewards(list.value?.map((m) => m.id) ?? []); // 일반 카드들 보상 채우기
      }

      if (count.status === "fulfilled") {
        setCompleteMission(count.value ?? 0);
      }

      if (user.status === "fulfilled") {
        // 응답 키가 달라도 닉네임 뽑아쓰기
        const u = user.value ?? {};
        const nick =
          u.nickname ??
          u.name ??
          u.nickName ??
          u.displayName ??
          u.username ??
          "";
        setNickname(String(nick).trim());
      }
    } catch (_) {
      // 개별 try-catch 처리되어 있으므로 여기선 무시
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const missionDetail = async (id) => {
    const result = await MissionDetailGet(id);
    setMissionDetailData(result);
    setIsMissionOpen(true);
  };

  const toMypage = () => navigate(`/mypage`);

  const displayName = nickname || "단골";

  // ✅ CodeInputModal에 넘길 동적 힌트 생성
  const codeHint = (() => {
    const name = getStoreName(missionDetailData);
    const code = getAuthCode(missionDetailData);
    if (!code) return ""; // 코드 없으면 힌트 숨김
    // 쿠폰함처럼 한 줄 안내형
    return `* 테스트용 인증코드 ${code}입니다.`; 
    // 혹은 가게명까지 보여주려면 아래로 교체:
    // return `* ${name} ${code} *`;
  })();

  return (
    <Page>
      <Header>
        <TitleBar pageName="일일미션" />
      </Header>

      {!loading ? (
        <ScrollArea>
          {/* 상단 히어로 - 닉네임 연동 ✅ */}
          <Hero>
            <span className="nick">{displayName}</span>
            <span className="plain">님의</span>
            <br />
            <span className="plain">완료한 미션&nbsp;</span>
            <span className="count">{completeMission}</span>
            <span className="plain">&nbsp;개</span>
          </Hero>

          {/* AI 추천 카드 */}
          {aiMissionData ? (
            <MissionCard className="is-ai" key={aiMissionData.missionId}>
              <AiPill>AI 추천</AiPill>
              <CardReset>
                <MainMissionCard
                  onClick={() => missionDetail(aiMissionData.missionId)}
                  data={{
                    ...aiMissionData,
                    // 상세에서 채운 보상 주입
                    rewardName: rewardById[aiMissionData.missionId] ?? "",
                  }}
                  recommended={true}
                />
              </CardReset>
            </MissionCard>
          ) : (
            <FailBox>
              <FlagLogo width="117px" height="106px" />
              <FailText>
                {`${displayName}님의 `}
                <span style={{ color: "#CE4927" }}>취향</span>을
                <br />
                알려주세요!
              </FailText>
              <FailButton onClick={() => toMypage()}>
                해시태그 설정하러가기
              </FailButton>
            </FailBox>
          )}

          <Divider />

          {/* 일반 카드들 */}
          <CardList>
            {missionData && missionData.length > 0 ? (
              missionData.map((m) => (
                <MissionCard key={m.id}>
                  <CardReset>
                    <MainMissionCard
                      onClick={() => missionDetail(m.id)}
                      data={{
                        ...m,
                        // 상세에서 채운 보상 주입
                        rewardName: rewardById[m.id] ?? "",
                      }}
                      recommended={false}
                    />
                  </CardReset>
                </MissionCard>
              ))
            ) : (
              <p>미션이 없습니다.</p>
            )}
          </CardList>
        </ScrollArea>
      ) : (
        <Loading />
      )}

      {/* 모달들 */}
      {isMissionOpen && (
        <MissionModal
          mission={{
            image: missionDetailData?.rewardImageUrl,
            title: missionDetailData?.title,
            store: missionDetailData?.storeName,
            reward: missionDetailData?.description,
            storeId: missionDetailData?.storeId,
          }}
          onClose={() => setIsMissionOpen(false)}
          onSubmit={() => {
            setIsMissionOpen(false);
            setIsCodeInputOpen(true);
          }}
        />
      )}

      {/* 인증코드 입력 모달: ✅ 동적 힌트/코드 전달 */}
      {isCodeInputOpen && (
        <CodeInputModal
          onClose={() => setIsCodeInputOpen(false)}
          missionId={missionDetailData?.id}               // 경로 등에 필요하면 사용
          authCode={getAuthCode(missionDetailData)}       // 모달 내부에서 검증/표시용
          hint={codeHint}                                  // 화면 표시용 힌트(쿠폰함 스타일)
          onSubmit={() => {
            getData();
            setIsCodeInputOpen(false);
            setIsSuccessOpen(true);
          }}
        />
      )}

      {isSuccessOpen && (
        <CouponSuccessModal onClose={() => setIsSuccessOpen(false)} />
      )}
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
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
    display: none !important;
  }
  --sbw: 14px;
  margin-right: calc(var(--sbw) * -1);
  padding-right: calc(24px + var(--sbw));
`;

const Hero = styled.div`
  margin: 12px 0 37px;
  line-height: 30px;
  text-align: left;
  .nick { color:#ce4927; font:600 24px/30px Pretendard,system-ui,sans-serif; }
  .plain { color:#141414; font:600 24px/30px Pretendard,system-ui,sans-serif; }
  .count { color:#cf4721; font:500 24px/30px Pretendard,system-ui,sans-serif; }
  br + .plain, .count ~ .plain { font-weight:500; }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #d9d9d9;
  margin: 30px 0 30px;
`;

const MissionCard = styled.div`
  background: #ffedd6;
  border-radius: 12px;
  padding: 16px 5px;
  position: relative;

  &.is-ai > div > button > div:first-child { display:none !important; }
  &.is-ai { background:#ffcec0; border:1.5px solid #eb1f00; }

  & > div > button > div:last-child { width:100%; display:flex; }
  & > div > button > div:last-child > div:first-child {
    display:flex; flex-direction:column; gap:20px;
    flex:1 1 auto; min-width:0; align-items:flex-start; text-align:left !important; width:100%;
  }
  & > div > button > div:last-child > div:first-child > * { align-self:stretch; margin:0; }
  & > div > button { padding-top:7px !important; padding-bottom:2px !important; }

  & > div > button > div:last-child > div:first-child > div:nth-child(3) {
    letter-spacing:-0.3px; word-spacing:-1px; font-kerning:normal; text-rendering:optimizeLegibility;
  }
`;

const AiPill = styled.div`
  position:absolute; top:-30px; left:12px; height:28px; padding:0 10px;
  display:inline-flex; align-items:center; background:#eb1f00; border:1px solid #e8512a;
  color:#fff; font:700 14px/26px Pretendard,system-ui,sans-serif; border-radius:8px 8px 0 0;
`;

const CardReset = styled.div`
  background: transparent !important; box-shadow:none !important; border:0 !important;
  & * { background: transparent !important; box-shadow:none !important; border:0 !important; }
`;

const CardList = styled.div`
  display:flex; flex-direction:column; gap:12px;
`;

const FailBox = styled.div`
  display:flex; align-items:center; justify-content:center; flex-direction:column; gap:20px;
  width:345px; height:313px; flex-shrink:0; border-radius:12px; background:#fff;
  box-shadow:0 4px 6px 0 rgba(0,0,0,0.1);
`;

const FailText = styled.div`
  color:#141414; text-align:center; font-family:Pretendard; font-size:24px; font-weight:700;
  line-height:30px; letter-spacing:-1px; text-align:center;
`;

const FailButton = styled.div`
  display:flex; align-items:center; justify-content:center; width:244px; height:45px; flex-shrink:0;
  border-radius:12px; background:#e8512a; color:#fff; text-align:center; font-family:Pretendard;
  font-size:14px; font-weight:500; line-height:30px; letter-spacing:-1px;
  &:hover { cursor:pointer; }
`;

