import SmallRightButton from "../../../assets/icons/small_right_button.svg?react";
import { Group, TextBox, Text, Button } from "../styles/Box";

export default function MyStamp() {
  return (
    <Group>
      <TextBox>
        <Text>
          <span style={{ color: "#CE4927" }}>단추</span>가 몇 개 안 남았어요!
        </Text>
        <Button>
          더보기 <SmallRightButton />
        </Button>
      </TextBox>
    </Group>
  );
}
