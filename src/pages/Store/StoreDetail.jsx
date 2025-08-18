import styled from "styled-components";
import MenuCard from "./components/MenuCard";
import LeftButton from "../../assets/icons/left_button.svg?react";
import Open from "../../assets/icons/open.svg?react";
import Close from "../../assets/icons/close.svg?react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { StoreDetailGet } from "../../shared/api/store";

export default function StoreDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const storeData = await StoreDetailGet(id);
      setData(storeData);
    };
    fetchData();
  }, [id]);

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
        <OpenClose>{data.open ? <Open /> : <Close />}</OpenClose>
        <StoreImg src={data.mainImageUrl} />
        <TextBox>
          <StoreName>{data.name}</StoreName>
          <StoreInfo>{data.description}</StoreInfo>
          <HashtagBox>
            {data.hashtags && data.hashtags.length > 0 ? (
              data.hashtags.map((hashtag) => (
                <Hashtag key={hashtag.id}>{hashtag.name}</Hashtag>
              ))
            ) : (
              <p>태그가 없습니다.</p>
            )}
          </HashtagBox>
        </TextBox>
        <InfoBox>
          • 가게 주소 - {data.address} <br />• 영업시간 - {data.openTime} ~{" "}
          {data.closeTime} <br />• 전화번호 - {data.phoneNumber} <br />
        </InfoBox>
        <Bar />
        <Menu>
          메뉴
          <MenuBox>
            {data.menu && data.menu.length > 0 ? (
              data.menu.map((menu) => <MenuCard key={menu.id} data={menu}/>)
            ) : (
              <p>메뉴가 없습니다.</p>
            )}
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
  height: 740px;
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
