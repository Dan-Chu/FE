import styled from "styled-components";

export default function MissionCard() {
  return (
    <Card>
      <Text>국수가락</Text>
      <Mission>
        <MissionName>콩국수 한 그릇 먹기!</MissionName>
        <Button>참여하기</Button>
      </Mission>
      <Text>보상: 탄산 음료 한 캔 쿠폰</Text>
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
`;
