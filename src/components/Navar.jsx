import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [page, setPage] = useState(3);

  const navigate = useNavigate();

  const buttonClick = (button) => {
    switch (button) {
      case "shop":
        setPage(1);
        navigate("/storeList");
        break;
      case "mission":
        setPage(2);
        navigate("/mission");
        break;
      case "main":
        setPage(3);
        navigate("/main");
        break;
      case "stamp":
        setPage(4);
        navigate("/stamp");
        break;
      case "mypage":
        setPage(5);
        navigate("/mypage");
        break;
    }
  };

  return (
    <Bar>
      <Button onClick={() => buttonClick("shop")} color={page == 1 ? 1 : 0}>
        {page == 1 ? <NowShopList /> : <NormalShopList />}가게목록
      </Button>
      <Button onClick={() => buttonClick("mission")} color={page == 2 ? 1 : 0}>
        {page == 2 ? <NowDailyMission /> : <NormalDailyMission />}일일미션
      </Button>
      <Button onClick={() => buttonClick("main")} line={page == 3 ? 1 : 0}>
        {page == 3 ? <NowMain /> : <NormalMain />}
      </Button>
      <Button onClick={() => buttonClick("stamp")} color={page == 4 ? 1 : 0}>
        {page == 4 ? <NowStamp /> : <NormalStamp />}스탬프
      </Button>
      <Button onClick={() => buttonClick("mypage")} color={page == 5 ? 1 : 0}>
        {page == 5 ? <NowMypage /> : <NormalMypage />}마이페이지
      </Button>
    </Bar>
  );
}

const Bar = styled.div`
  display: flex;
  width: 393px;
  padding: 0;
  justify-content: space-between;
  position: absolute;
  bottom: 0%;
  background-color: #ffff;
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
