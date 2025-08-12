import styled from "styled-components";
import "./App.css";
import "pretendard/dist/web/static/pretendard.css";
import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import Navar from "../src/components/Navar.jsx";
import Home from "./pages/Home/Home.jsx";
import Login1 from "./pages/Login/Login1.jsx";
import Splash from "./pages/Splash/splash.jsx";
import Login2 from "./pages/Login/Login2.jsx";
import StoreList from "./pages/Store/StoreList.jsx";
import StoreDetail from "./pages/Store/StoreDetail.jsx";

function App() {

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash/>}/>
            <Route path="/login1" element={<Login1 />} />
            <Route path="/login2" element={<Login2 />} />
            <Route element={<WithNavar/>}>
              <Route path="/main" element={<Home />} />
              <Route path="/storeList" element={<StoreList />} />
            </Route>
            <Route path="/storeList/storeDetail" element={<StoreDetail />} />
          </Routes>
        </BrowserRouter>
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
  height: calc(100vh - 91px);
`;

export default App;
