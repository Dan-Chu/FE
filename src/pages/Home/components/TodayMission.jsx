import SmallRightButton from "../../../assets/icons/small_right_button.svg?react";
import { Group, TextBox, Text, Button } from "../styles/Box";
import MissionCard from "../../../components/MissionCard";

export default function TodayMission() {
  return (
    <Group>
      <TextBox>
        <Text>
          오늘 가장 인기있는 <span style={{ color: "#CE4927" }}>미션</span>
        </Text>
        <Button>
          더보기 <SmallRightButton />
        </Button>
      </TextBox>
      <MissionCard />
    </Group>
  );
}
