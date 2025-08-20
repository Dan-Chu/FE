import SmallRightButton from "../../../assets/icons/small_right_button.svg?react";
import { Group, TextBox, Text, Button } from "../styles/Box";
import MissionCard from "../../../components/MissionCard";
import { useNavigate } from "react-router-dom";

export default function TodayMission({data}) {
    const navigate=useNavigate();
  
    const toMission=()=>{
      navigate("/mission");
    }
  return (
    <Group>
      <TextBox>
        <Text>
          오늘 가장 인기있는 <span style={{ color: "#CE4927" }}>미션</span>
        </Text>
        <Button onClick={()=>toMission()}>
          더보기 <SmallRightButton />
        </Button>
      </TextBox>
      <MissionCard data={data}/>
    </Group>
  );
}
