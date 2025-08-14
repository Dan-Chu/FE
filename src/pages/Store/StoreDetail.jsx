import styled from "styled-components";
import MenuCard from "./components/MenuCard";
import LeftButton from "../../assets/icons/left_button.svg?react";
import ex_img from "../../assets/images/example_shop_img.jpg";
import Open from "../../assets/icons/open.svg?react";
import Close from "../../assets/icons/close.svg?react";
import { useNavigate,useParams } from "react-router-dom";
import { useEffect } from "react";
import { StoreDetailGet } from "../../shared/api/store";

export default function StoreDetail() {
  const on = 1;
  const navigate = useNavigate();
  const { storeId } = useParams();

  // useEffect(()=>{
  //   let data= StoreDetailGet(storeId);
  // },[storeId]);

  const toStoreList = () => {
    navigate(-1);
  };

  return (
    <Page>
      <Header>
        <LeftButton onClick={() => toStoreList()} />
        가게정보
      </Header>
      <Contents>
        <OpenClose>{on ? <Open /> : <Close />}</OpenClose>
        <StoreImg src={ex_img} />
        <TextBox>
          <StoreName>가게이름이름</StoreName>
          <StoreInfo>
            가게 설명 가게 설명 가게 설명 가게 설명 가게 설명 가게 설명 가게
            설명 가게 설명 가게 설명
          </StoreInfo>
          <HashtagBox>
            <Hashtag>해시태그</Hashtag>
            <Hashtag>해시태그</Hashtag>
            <Hashtag>해시태그</Hashtag>
            <Hashtag>해시태그</Hashtag>
          </HashtagBox>
        </TextBox>
        <InfoBox>
          • 가게 주소 - 성북구 고길동 <br />
          • 영업시간 - 10:00 ~ 22:00 <br />
          • 전화번호 - 010-1234-5678 <br />
        </InfoBox>
        <Bar />
        <Menu>
          메뉴
          <MenuBox>
            <MenuCard />
            <MenuCard />
            <MenuCard />
            <MenuCard />
          </MenuBox>
        </Menu>
      </Contents>
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 25px;
  height: calc(100vh - 25px);
`;
const Header = styled.div`
  display: flex;
  color: #141414;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 30px; /* 125% */
  letter-spacing: -1px;
  margin-left: 24px;
  justify-content: flex-start;
  align-items: center;
  gap: 121px;
  height: 80px;
`;
const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  overflow-x: hidden;
  overflow-y: auto;
  white-space: nowrap;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;
`;
const OpenClose = styled.div``;
const StoreImg = styled.img`
  width: 345px;
  height: 282px;
  flex-shrink: 0;
  border-radius: 12px;
  background: url(<path-to-image>) lightgray 50% / cover no-repeat;
  margin-left: 24px;
`;
const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-left: 24px;
  gap: 10px;
  width: 345px;
`;
const StoreName = styled.div`
  color: #141414;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 30px; /* 125% */
  letter-spacing: -1px;
`;
const StoreInfo = styled.div`
  color: #5d5d5d;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 25px; /* 178.571% */
  letter-spacing: -0.5px;
  width: 345px;
  white-space: normal;
`;
const HashtagBox = styled.div`
  display: flex;
  gap: 10px;
`;
const Hashtag = styled.div`
  display: flex;
  width: 75px;
  height: 31px;
  flex-shrink: 0;
  border-radius: 18px;
  border: 1px solid #e8512a;
  background: #fff;
  justify-content: center;
  align-items: center;

  color: #e8512a;
  text-align: center;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 0; /* 0% */
  letter-spacing: -1px;
`;
const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 344px;
  height: 126px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #ffedd6;
  margin-left: 24px;
  text-align: left;
  justify-content: center;
  padding-left: 12px;

  color: #141414;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 25px; /* 178.571% */
  letter-spacing: -1px;
`;
const Bar = styled.div`
  width: 100%;
  height: 15px;
  flex-shrink: 0;
  background: #eaeaea;
`;
const Menu = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 30px;
  margin-left: 24px;

  color: #141414;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 30px; /* 125% */
  letter-spacing: -1px;
`;
const MenuBox = styled.div`
  display: flex;
  flex-direction: column;
`;
