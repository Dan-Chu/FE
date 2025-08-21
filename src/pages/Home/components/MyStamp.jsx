import SmallRightButton from "../../../assets/icons/small_right_button.svg?react";
import { Group, TextBox, Text, Button } from "../styles/Box";
import StampCard from "../../../components/StampCard";
import { useNavigate } from "react-router-dom";

export default function MyStamp({data}) {
    const navigate=useNavigate();
  
    const toStamp=()=>{
      navigate("/stamp");
    }
  return (
    <Group>
      <TextBox>
        <Text>
          <span style={{ color: "#CE4927" }}>단추</span>가 몇 개 안 남았어요!
        </Text>
        <Button onClick={()=>toStamp()}>
          더보기 <SmallRightButton />
        </Button>
      </TextBox>
      {data? <StampCard data={data}/>:""}
    </Group>
  );
}
