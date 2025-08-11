import styled from "styled-components";
import ToYou from "../../assets/icons/splash_to_you.svg?react";
import DanchuService from "../../assets/icons/splash_danchu_service.svg?react";
import TextDanchu from "../../assets/logos/text_danchu.svg?react";
import BigLogo from "../../assets/logos/big_logo.svg?react";

export default function Splash() {
  return (
    <Page>
      <Box>
        <ToYou />
        <DanchuService />
        <TextDanchu />
      </Box>
      <div style={{width:"221px", height:"204px", paddingLeft:"70px"}}>
      <BigLogo />
      </div>
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fffcf8;
  height: 100vh;
  padding-left: 44px;
  padding-top: 148px;
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-bottom: 188px;
`;
