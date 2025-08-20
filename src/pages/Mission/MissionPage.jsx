// src/pages/Mission/MissionPage.jsx
import { useEffect, useState } from "react";
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

export default function MissionPage() {
  const [isMissionOpen, setIsMissionOpen] = useState(false);
  const [isCodeInputOpen, setIsCodeInputOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [aiMissionData, setAiMissionData] = useState();
  const [missionData, setMissionData] = useState();
  const [missionDetailData, setMissionDetailData] = useState();

  // 바깥 스크롤 잠금
  useEffect(() => {
    document.body.classList.add("no-body-scroll");
    return () => document.body.classList.remove("no-body-scroll");
  }, []);

  const getData = async () => {
    try {
      const result = await AiMissionGet();
      setAiMissionData(result);
    } catch (err) {
      console.warn("AiMissionGet 실패:", err);
    }

    try {
      const result = await MissionListGet();
      setMissionData(result);
    } catch (err) {
      console.warn("MissionListGet 실패:", err);
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

  return (
    <Page>
      <Header>
        <TitleBar pageName="일일미션" />
      </Header>

      <ScrollArea>
        <Hero>
          <span className="nick">김단추</span>
          <span className="plain">님의</span>
          <br />
          <span className="plain">완료한 미션&nbsp;</span>
          <span className="count">NN</span>
          <span className="plain">&nbsp;개</span>
        </Hero>

        {/* AI 추천 카드 */}
        {aiMissionData ? (
          <MissionCard className="is-ai" key={aiMissionData.id}>
            <AiPill>AI 추천</AiPill>
            <CardReset>
              <MainMissionCard
                onClick={() => missionDetail(aiMissionData.id)}
                data={aiMissionData}
                recommended={true}
              />
            </CardReset>
          </MissionCard>
        ) : (
          <p>해시태그가 없어 추천이 어렵습니다.</p>
        )}

        <Divider />

        {/* 일반 카드들 */}
        <CardList>
          {missionData && missionData.length > 0 ? (
            missionData.map((data) => (
              <MissionCard>
                <CardReset>
                  <MainMissionCard
                    key={data.id}
                    onClick={() => missionDetail(data.id)}
                    data={data}
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
          authCode={missionDetailData.storeAuthCode}
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

  /* 세로 스크롤만 */
  overflow-y: auto;
  overflow-x: hidden;

  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  /* 하단 네비 여백 + 좌우 24 */
  padding: 0 24px calc(90px + env(safe-area-inset-bottom));

  /* 스크롤바 숨김 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* old Edge/IE */
  &::-webkit-scrollbar {
    /* Chrome/Safari */
    width: 0 !important;
    height: 0 !important;
    display: none !important;
  }

  /* 오버레이 스크롤바 마스킹(항상 표시 옵션 대비) */
  --sbw: 14px;
  margin-right: calc(var(--sbw) * -1);
  padding-right: calc(24px + var(--sbw));
`;

const Hero = styled.div`
  margin: 12px 0 16px;
  line-height: 30px;
  text-align: left;

  .nick {
    color: #ce4927;
    font: 600 24px/30px Pretendard, system-ui, sans-serif;
  }
  .plain {
    color: #141414;
    font: 600 24px/30px Pretendard, system-ui, sans-serif;
  }
  .count {
    color: #cf4721;
    font: 500 24px/30px Pretendard, system-ui, sans-serif;
  }

  /* 두 번째 줄은 500으로 */
  br + .plain,
  .count ~ .plain {
    font-weight: 500;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #d9d9d9;
  margin: 14px 0 12px;
`;

const MissionCard = styled.div`
  background: #ffedd6;
  border-radius: 12px;
  padding: 16px 14px;
  position: relative;

  &.is-ai {
    background: #ffcec0;
    border: 1.5px solid #eb1f00;
  }
`;

const AiPill = styled.div`
  position: absolute;
  top: -12px;
  left: 12px;
  height: 26px;
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
  /* 내부 카드 배경/테두리/섀도우 제거 */
  background: transparent !important;
  box-shadow: none !important;
  border: 0 !important;

  & * {
    background: transparent !important;
    box-shadow: none !important;
    border: 0 !important;
  }
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
