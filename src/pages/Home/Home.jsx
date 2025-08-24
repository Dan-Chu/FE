import styled from "styled-components";
import TitleBar from "../../components/TitleBar";
import AiSuggestGroup from "./components/AiSuggestGroup";
import TodayMission from "./components/TodayMission";
import MyStamp from "./components/MyStamp";
import { useEffect, useState } from "react";
import { AiStoreGet } from "../../shared/api/openAI";
import { PopularMissionGet } from "../../shared/api/mission";
import { ExpiringStampGet } from "../../shared/api/stamp";
import { getUser } from "../../shared/api/user";
import TextLogo from "../../assets/logos/text_danchu.svg?react";
import Loading from "../../components/Loading";

export default function Home() {
  const [storeData, setStoreData] = useState("");
  const [missionData, setMissionData] = useState("");
  const [stampData, setStampData] = useState("");
  const [loading,setLoading]=useState(true);
  const [nickname,setNickname]=useState("김")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try{
        const result=await getUser();
        setNickname(result.nickname);
      } catch(err){
        console.warn("AiStoreGet 실패:", err);
        setNickname("김"); // 실패해도 기본값 세팅 가능
      }
      try{
        const result=await AiStoreGet();
        setStoreData(result);
      } catch(err){
        console.warn("AiStoreGet 실패:", err);
        setStoreData(null); // 실패해도 기본값 세팅 가능
      }
      try{
        const result=await PopularMissionGet();
        setMissionData(result);
      } catch(err){
        console.warn("PopularMissionGet 실패:", err);
        setMissionData(null); // 실패해도 기본값 세팅 가능
      }
      try{
        const result=await ExpiringStampGet();
        setStampData(result);
      } catch(err){
        console.warn("ExpiringStampGet 실패:", err);
        setStampData(null); // 실패해도 기본값 세팅 가능
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Page>
      <TitleBar pageName={<TextLogo width="51.859px" height="26.878px" />} />
      {!loading ? (
        <Contents>
        <Text>
          {nickname}<span style={{fontWeight:400}}>님을 위한</span> <br/>단추 &nbsp;
          <span style={{ color: "#CE4927"}}>PICK!</span>
        </Text>
        <AiSuggestGroup data={storeData} />
        <Box>
          <TodayMission data={missionData} />
          <MyStamp data={stampData} />
        </Box>
      </Contents>
      ):<Loading/>}
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
  gap: 25px;
`;
const Text = styled.div`
  color: #141414;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 30px; /* 125% */
  letter-spacing: -1px;
  text-align: left;
  margin-top: 31px;
  margin-left: 24px;
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-left: 24px;
  padding-bottom: 59px;
`;
