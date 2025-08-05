import styled from "styled-components";
import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import NormalShopList from "../assets/icons/normal_shop_list.svg?react";
import NormalDailyMission from "../assets/icons/normal_daily_mission.svg?react";
import NormalStamp from "../assets/icons/normal_stamp.svg?react";
import NormalMypage from "../assets/icons/normal_mypage.svg?react";
import NormalMain from "../assets/icons/normal_main.svg?react";
import NowShopList from "../assets/icons/now_shop_list.svg?react";
import NowDailyMission from "../assets/icons/now_daily_mission.svg?react";
import NowStamp from "../assets/icons/now_stamp.svg?react";
import NowMypage from "../assets/icons/now_mypage.svg?react";

export default function Navar() {
  const [shopList, setShopList] = useState(0);
  const [dailyMission, setDailyMission] = useState(0);
  const [main, setMain] = useState(1);
  const [stamp, setStamp] = useState(0);
  const [mypage, setMypage] = useState(0);

  //const navigate = useNavigate();

  const buttonClick = (button) => {
    switch (button) {
      case "shop":
        setShopList(1);
        setDailyMission(0);
        setMain(0);
        setStamp(0);
        setMypage(0);

        //navigate("/");
        break;
      case "mission":
        setShopList(0);
        setDailyMission(1);
        setMain(0);
        setStamp(0);
        setMypage(0);

        //navigate("/");
        break;
      case "main":
        setShopList(0);
        setDailyMission(0);
        setMain(1);
        setStamp(0);
        setMypage(0);

        //navigate("/");
        break;
      case "stamp":
        setShopList(0);
        setDailyMission(0);
        setMain(0);
        setStamp(1);
        setMypage(0);

        //navigate("/");
        break;
      case "mypage":
        setShopList(0);
        setDailyMission(0);
        setMain(0);
        setStamp(0);
        setMypage(1);

        //navigate("/");
        break;
    }
  };

  return (
    <Bar>
      <Button onClick={() => buttonClick("shop")} color={shopList ? 1 : 0}>
        {shopList ? <NowShopList /> : <NormalShopList />}가게목록
      </Button>
      <Button
        onClick={() => buttonClick("mission")}
        color={dailyMission ? 1 : 0}
      >
        {dailyMission ? <NowDailyMission /> : <NormalDailyMission />}일일미션
      </Button>
      <Button onClick={() => buttonClick("main")} line={main ? 1 : 0}>
        {main ? <NowMain /> : <NormalMain />}
      </Button>
      <Button onClick={() => buttonClick("stamp")} color={stamp ? 1 : 0}>
        {stamp ? <NowStamp /> : <NormalStamp />}스탬프
      </Button>
      <Button onClick={() => buttonClick("mypage")} color={mypage ? 1 : 0}>
        {mypage ? <NowMypage /> : <NormalMypage />}마이페이지
      </Button>
    </Bar>
  );
}

const Bar = styled.footer`
  display: flex;
  width: 393px;
  padding: 0;
  justify-content: space-between;
  position: absolute;
  bottom: 0%;
`;
const Button = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${({ color }) => (color ? "#CF4721" : "black")};
  width: 75px;
  height: 90px;
  font-size: 12px;

  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 4px;
    border-radius: 15px;
    background-color: ${({ line }) => (line ? "#D9D9D9" : "transparent")};
  }
`;
const NowMain = styled(NormalMain)`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`;
