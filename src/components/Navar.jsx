import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

    // 네비를 감출 페이지들
  const HIDE_ON = [
    "/mypage/edit",     // 내 정보 페이지
    "/mypage/coupons", // 쿠폰함 페이지
  ];


  const getPageIndex = () => {
    switch (currentPath) {
      case "/storeList":
        return 1;
      case "/mission":
        return 2;
      case "/main":
        return 3;
      case "/stamp":
        return 4;
      case "/mypage":
        return 5;
      default:
        return 3;
    }
  };
  const page = getPageIndex();

  const buttonClick = (button) => {
    switch (button) {
      case "shop":
        navigate("/storeList");
        break;
      case "mission":
        navigate("/mission");
        break;
      case "main":
        navigate("/main");
        break;
      case "stamp":
        navigate("/stamp");
        break;
      case "mypage":
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
      <Button onClick={() => buttonClick("main")} $line={page == 3 ? 1 : 0}>
        {page == 3 ? <MainButton><NowMain /></MainButton> : <NormalMain height="60px"/>}
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
  height: 70px;
  padding: 0;
  justify-content: space-between;
  position: absolute;
  bottom: 0%;
  background-color: #ffff;
  z-index: 10;
`;
const Button = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${({ color }) => (color ? "#CF4721" : "black")};
  width: 75px;
  height: 70px;
  font-size: 12px;

  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 4px;
    border-radius: 15px;
    background-color: ${({ $line }) => ($line ? "#D9D9D9" : "transparent")};
  }
`;
const NowMain = styled(NormalMain)`
  width: 70px;
  height: 70px;

`;
const MainButton = styled(Button)`
  color: white;
  border-radius: 50%;
  position: relative;
  top: -10px; /* 하단바 위로 튀어나옴 */
  z-index: 20; /* 다른 버튼보다 위에 */
`;
