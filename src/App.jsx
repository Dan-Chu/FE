import styled from "styled-components";
import "./App.css";
import Navar from "../src/components/Navar.jsx";
import Home from "./pages/Home/Home.jsx";

function App() {
  return (
    <Phone>
      <Contents>
        <Home/>
      </Contents>
      <Navar />
    </Phone>
  );
}

const Phone = styled.div`
  position: relative;
  width: 393px;
  min-height: 100vh;
  margin-left: auto;
  margin-right: auto;
  background-color: #FAF8F8;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
`;
const Contents = styled.div`
  padding-left: 28px;
  padding-top: 21px;
`;

export default App;
