// src/App.jsx
import styled from "styled-components";
import "./App.css";
import "pretendard/dist/web/static/pretendard.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"; // ⬅️ dom 로 변경

import Navar from "../src/components/Navar.jsx";
import Home from "./pages/Home/Home.jsx";
import Login1 from "./pages/Login/Login1.jsx";
import Splash from "./pages/Splash/splash.jsx";
import Login2 from "./pages/Login/Login2.jsx";
import StoreList from "./pages/Store/StoreList.jsx";
import StoreDetail from "./pages/Store/StoreDetail.jsx";
import Mypage from "./pages/Mypage/Mypage";
import EditProfile from "./pages/Mypage/EditProfile";
import CouponPage from "./pages/Mypage/CouponPage";
import MissionPage from "./pages/Mission/MissionPage";
import StampPage from "./pages/Stamp/StampPage";

export default function App() {
  function WithNavar() {
    return (
     <>
        <Contents>       {/* 하단 Nav 높이만큼 패딩 */}
          <Outlet />
        </Contents>
        <Navar />
      </>
    );
  }

  function WithoutNav() {
    return (
      <ContentsFull>    {/* Nav 없음: 풀 높이 */}
        <Outlet />
      </ContentsFull>
    );
  }

  return (
    <Phone>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login1" element={<Login1 />} />
          <Route path="/login2" element={<Login2 />} />

          {/* 하단 네비가 필요한 페이지들 */}
          <Route element={<WithNavar />}>
            <Route path="/main" element={<Home />} />
            <Route path="/storeList" element={<StoreList />} />
            <Route path="/mission" element={<MissionPage />} />
            <Route path="/stamp" element={<StampPage />} />
            <Route path="/mypage" element={<Mypage />} />
          </Route>

          {/* ✅ Nav 숨길 페이지들 */}
        <Route element={<WithoutNav />}>
           <Route path="/mypage/edit" element={<EditProfile />} />
           <Route path="/mypage/coupons" element={<CouponPage />} />
+        </Route>

          <Route path="/storeList/storeDetail/:id" element={<StoreDetail />} />
        </Routes>
      </BrowserRouter>
    </Phone>
  );
}

const Phone = styled.div`
  position: relative;
  width: 393px;
  height: 100vh;
  margin-left: auto;
  margin-right: auto;
  background-color: #faf8f8;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden; /* 바깥 스크롤 숨김 */
`;

const Contents = styled.div`
  padding-top: 21px;
  height: 674px;
`;

/* ✅ Nav가 없을 때: 하단 패딩 제거 */
const ContentsFull = styled(Contents)`
  padding-bottom: 0;
`;