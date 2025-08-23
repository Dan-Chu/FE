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

export default function MissionPage() {
  const navigate = useNavigate();
  const [isMissionOpen, setIsMissionOpen] = useState(false);
  const [isCodeInputOpen, setIsCodeInputOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [aiMissionData, setAiMissionData] = useState();
  const [missionData, setMissionData] = useState();
  const [missionDetailData, setMissionDetailData] = useState();

  const [completeMission, setCompleteMission] = useState(0);
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

  const getData = async () => {
    try {
      const result = await AiMissionGet();
      setAiMissionData(result);
      if (result?.missionId) fetchRewards([result.missionId]); // AI 카드 보상 채우기
    } catch (err) {
      console.warn("AiMissionGet 실패:", err);
    }
    try {
      const list = await MissionListGet();
      setMissionData(list);
      fetchRewards(list?.map((m) => m.id) ?? []); // 일반 카드들 보상 채우기
    } catch (err) {
      console.warn("MissionListGet 실패:", err);
    }
    try {
      const count = await CompleteMissionGet();
      setCompleteMission(count ?? 0);
    } catch (err) {
      console.warn("CompleteMissionGet 실패:", err);
    }
    try {
      const user = await getUser();
      setNickname(user?.nickname ?? user?.name ?? user?.nickName ?? "");
    } catch (err) {
      console.warn("getUser 실패:", err);
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

  return (
    <Page>
      <Header>
        <TitleBar pageName="일일미션" />
      </Header>

      <ScrollArea>
        <Hero>
          <span className="nick">{nickname || "(…)"}</span>
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
              {`${nickname || "김단골"}님의 `}
              <span style={{ color: "#CE4927" }}>취향</span>을
              <br />
              알려주세요!
            </FailText>
            <FailButton onClick={toMypage}>해시태그 설정하러가기</FailButton>
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

      {isCodeInputOpen && (
        <CodeInputModal
          onClose={() => setIsCodeInputOpen(false)}
          onSubmit={() => {
            getData();
            setIsCodeInputOpen(false);
            setIsSuccessOpen(true);
          }}
          authCode={missionDetailData?.storeAuthCode}
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
  margin: 0px 0 17px;
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
  &::-webkit-scrollbar { width: 0; height: 0; display: none; }

  --sbw: 14px;
  margin-right: calc(var(--sbw) * -1);
  padding-right: calc(24px + var(--sbw));
`;

const Hero = styled.div`
  margin: 12px 0 37px;
  line-height: 30px;
  text-align: left;

  .nick { color: #ce4927; font: 600 24px/30px Pretendard, system-ui, sans-serif; }
  .plain { color: #141414; font: 600 24px/30px Pretendard, system-ui, sans-serif; }
  .count { color: #cf4721; font: 500 24px/30px Pretendard, system-ui, sans-serif; }

  br + .plain, .count ~ .plain { font-weight: 500; }
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

  &.is-ai > div > button > div:first-child { display: none !important; }
  &.is-ai { background: #ffcec0; border: 1.5px solid #eb1f00; }

  & > div > button > div:last-child { width: 100%; display: flex; }

  & > div > button > div:last-child > div:first-child {
    display: flex; flex-direction: column; gap: 20px;
    flex: 1 1 auto; min-width: 0; align-items: flex-start;
    text-align: left !important; width: 100%;
  }

  & > div > button > div:last-child > div:first-child > * {
    align-self: stretch; margin: 0;
  }

  & > div > button { padding-top: 7px !important; padding-bottom: 2px !important; }
`;

const AiPill = styled.div`
  position: absolute;
  top: -30px;
  left: 12px;
  height: 28px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  background: #eb1f00;
  border: 1px solid #e8512a;
  color: #fff;
  font: 700 14px/26px Pretendard, system-ui, sans-serif;
  border-radius: 8px 8px 0 0;
`;

const CardReset = styled.div`
  background: transparent !important;
  box-shadow: none !important;
  border: 0 !important;
  & * { background: transparent !important; box-shadow: none !important; border: 0 !important; }
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FailBox = styled.div`
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 20px;
  width: 345px; height: 313px; flex-shrink: 0;
  border-radius: 12px; background: #fff;
  box-shadow: 0 4px 6px 0 rgba(0,0,0,0.1);
`;
const FailText = styled.div`
  color: #141414; text-align: center;
  font-family: Pretendard; font-size: 24px; font-weight: 700;
  line-height: 30px; letter-spacing: -1px;
`;
const FailButton = styled.div`
  display: flex; align-items: center; justify-content: center;
  width: 244px; height: 45px; flex-shrink: 0;
  border-radius: 12px; background: #e8512a;
  color: #fff; font-family: Pretendard; font-size: 14px; font-weight: 500; line-height: 30px; letter-spacing: -1px;
  &:hover { cursor: pointer; }
`;
