import styled from "styled-components";
import "./App.css";
import "pretendard/dist/web/static/pretendard.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import Navar from "../src/components/Navar.jsx";
import Home from "./pages/Home/Home.jsx";
import Login1 from "./pages/Login/Login1.jsx";
import Splash from "./pages/Splash/splash.jsx";
import Login2 from "./pages/Login/Login2.jsx";
import StoreList from "./pages/Store/StoreList.jsx";
import StoreDetail from "./pages/Store/StoreDetail.jsx";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // 2초 후 사라짐
    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  function WithNavar() {
    return (
      <>
        <Contents>
          <Outlet />
        </Contents>
        <Navar />
      </>
    );
  }

  return (
    <Phone>
      {showSplash ? (
        <Splash />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login1 />} />
            <Route element={<WithNavar/>}>
              <Route path="/main" element={<Home />} />
              <Route path="/storeList" element={<StoreList />} />
            </Route>
            <Route path="/storeList/storeDetail" element={<StoreDetail />} />
          </Routes>
        </BrowserRouter>
      )}
    </Phone>
  );
}

const Phone = styled.div`
  position: relative;
  width: 393px;
  min-height: 100vh;
  margin-left: auto;
  margin-right: auto;
  background-color: #faf8f8;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
`;
const Contents = styled.div`
  padding-top: 21px;
  height: calc(100vh - 111px);
`;

export default App;
