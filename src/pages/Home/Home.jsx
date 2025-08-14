import styled from "styled-components";
import TitleBar from "../../components/TitleBar";
import AiSuggestGroup from "./components/AiSuggestGroup";
import TodayMission from "./components/TodayMission";
import MyStamp from "./components/MyStamp";

export default function Home() {

  return (
    <Page>
      <TitleBar pageName="AI 추천" />
      <Contents>
        <Text>
          <span style={{ color: "#CE4927", fontWeight: "600" }}>김단추</span>
          <span style={{ fontWeight: "600" }}>님을</span>
          <br />
          위한 맞춤형 추천
        </Text>
        <AiSuggestGroup />
        <Box>
          <TodayMission />
          <MyStamp />
        </Box>
      </Contents>
    </Page>
  );
}
const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const Contents = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  white-space: nowrap;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;
  gap: 30px;
`;
const Text = styled.div`
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px;
  text-align: left;

  margin-top: 31px;
  margin-left: 24px;
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-left: 24px;
  padding-bottom: 10px;
`;
