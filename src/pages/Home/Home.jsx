import styled from "styled-components";
import Nowpage from "../../components/Nowpage";
import AiSuggestGroup from "./components/AiSuggestGroup";
import TodayMission from "./components/TodayMission";
import MyStamp from "./components/MyStamp";

export default function Home() {
  return (
    <>
      <Nowpage pageName="AI 추천" />
      <Contents>
        <Text>
          <span style={{ color: "#CE4927", fontWeight: "600" }}>김단추</span>
          <span style={{ fontWeight: "600" }}>님을</span>
          <br />
          위한 맞춤형 추천
        </Text>
        <AiSuggestGroup />
        <TodayMission />
        <MyStamp />
      </Contents>
    </>
  );
}

const Text = styled.div`
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px;
  text-align: left;

  margin-top: 31px;
  margin-bottom: 27px;
`;
const Contents = styled.div`
  display: flex;
  height: 700px;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  white-space: nowrap;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;
`;
