import styled from "styled-components";
import "./App.css";
import Navar from "../src/components/Navar.jsx";
import Home from "./pages/Home/Home.jsx";
import Login1 from "./pages/Login/Login1.jsx";
import Splash from "./pages/Splash/splash.jsx";
import Login2 from "./pages/Login/Login2.jsx";

function App() {
  return (
    <Phone>
      {/* <Splash/> */}
      {/* <Login1 /> */}
      <Login2/>
      {/* <Contents>
        <Home/>
      </Contents>
      <Navar /> */}
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
