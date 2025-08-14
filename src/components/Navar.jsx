// src/components/Navar.jsx
import styled from "styled-components";
import { NavLink } from "react-router-dom";

import NormalShopListIcon from "../assets/icons/normal_shop_list.svg?react";
import NormalDailyMissionIcon from "../assets/icons/normal_daily_mission.svg?react";
import NormalStampIcon from "../assets/icons/normal_stamp.svg?react";
import NormalMypageIcon from "../assets/icons/normal_mypage.svg?react";
import NormalMainIcon from "../assets/icons/normal_main.svg?react";

import NowShopListIcon from "../assets/icons/now_shop_list.svg?react";
import NowDailyMissionIcon from "../assets/icons/now_daily_mission.svg?react";
import NowStampIcon from "../assets/icons/now_stamp.svg?react";
import NowMypageIcon from "../assets/icons/now_mypage.svg?react";
import NowMainIcon from "../assets/icons/now_main.svg?react";

export default function Navar() {
  return (
    <Bar>
      <Item to="/shops">
        {({ isActive }) => (
          <Button $active={isActive}>
            {isActive ? <NowShopListIcon /> : <NormalShopListIcon />}
            가게목록
          </Button>
        )}
      </Item>

      <Item to="/missions">
        {({ isActive }) => (
          <Button $active={isActive}>
            {isActive ? <NowDailyMissionIcon /> : <NormalDailyMissionIcon />}
            일일미션
          </Button>
        )}
      </Item>

      {/* 루트는 end 안 주면 항상 활성 처리됨 → end 꼭! */}
      <Item to="/" end>
        {({ isActive }) => (
          <Button $line={isActive}>
            {isActive ? <NowMainIcon /> : <NormalMainIcon />}
          </Button>
        )}
      </Item>

      <Item to="/stamp">
        {({ isActive }) => (
          <Button $active={isActive}>
            {isActive ? <NowStampIcon /> : <NormalStampIcon />}
            스탬프
          </Button>
        )}
      </Item>

      <Item to="/mypage">
        {({ isActive }) => (
          <Button $active={isActive}>
            {isActive ? <NowMypageIcon /> : <NormalMypageIcon />}
            마이페이지
          </Button>
        )}
      </Item>
    </Bar>
  );
}

/* styles */
const Bar = styled.nav`
  position: fixed;
  left: 0; right: 0; bottom: 0;
  width: 100%;
  display: flex; justify-content: space-between;
  background-color: #fff;
  z-index: 1000;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
`;

const Item = styled(NavLink)`
  text-decoration: none;
  width: 20%;
  display: flex; justify-content: center;
`;

const Button = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 75px;
  height: 90px;
  font-size: 12px;
  color: ${({ $active }) => ($active ? "#CF4721" : "black")};
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
    background-color: ${({ $line }) => ($line ? "#D9D9D9" : "transparent")};
  }
`;
