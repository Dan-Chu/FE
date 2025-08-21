import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function MissionCard({data}) {
  const navigate = useNavigate();

  const toMission = () => {
    navigate("/mission");
  };
  return (
    <Card>
      <Text>{data.storeName}</Text>
      <Mission>
        <MissionName>{data.title}</MissionName>
        <Button onClick={() => toMission()}>참여하기</Button>
      </Mission>
      <RewardText>보상: {data.reward}</RewardText>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  width: 301px;
  height: 135px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #ffedd6;
  text-align: left;
  padding-right: 24px;
  padding-left: 20px;
  padding-top: 14px;
  flex-direction: column;
  gap: 9px;
`;
const Text = styled.div`
  color: #5d5d5d;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 30px; /* 214.286% */
  letter-spacing: -1px;
  height: 30px;
`;
const Mission = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 35px;
`;
const MissionName = styled.span`
  color: #141414;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 30px; /* 125% */
  letter-spacing: -1px;
`;
const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 74px;
  height: 35px;
  flex-shrink: 0;
  border-radius: 16px;
  background: #e8512a;
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 30px; /* 214.286% */
  letter-spacing: -1px;

  &:hover {
    cursor: pointer;
  }
`;

const RewardText = styled.div`
  color: #5d5d5d;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: -1px;
  height: 30px;
  margin-top: 15px;
`;
