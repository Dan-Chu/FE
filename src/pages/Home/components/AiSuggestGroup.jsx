import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import RightButton from "../../../assets/icons/right_button.svg?react";
import FlagLogo from "../../../assets/logos/flag_logo.svg?react"

export default function AiSuggestGroup({ data }) {
  const navigate = useNavigate();

  const toStoreDetail = (id) => {
    navigate(`/storeList/storeDetail/${id}`);
  };
  const toMypage=()=>{
    navigate(`/mypage`);
  }
  return (
    <Group>
      {data && data.length > 0 ? (
        data.map((store) => (
          <AiSuggestCard onClick={() => toStoreDetail(store.id)} key={store.id}>
            <ShopImg src={store.mainImageUrl} />
            <Explain>
              <ShopName>
                {store.name}
                <RightButton/>
              </ShopName>
              <Hashtag>
                {store.hashtags && store.hashtags.length > 0 ? (
                  store.hashtags.map((tags) => (
                    <span key={tags.id}>{tags.name}</span>
                  ))
                ) : (
                  <p>태그가 없습니다.</p>
                )}
              </Hashtag>
            </Explain>
          </AiSuggestCard>
        ))
      ) : (
        <FailBox>
          <FlagLogo width="117px" height="106px"/>
          <FailText>김단골님의 <span style={{color:"#CE4927"}}>취향</span>을<br/>알려주세요!</FailText>
          <FailButton onClick={()=>toMypage()}>
            해시태그 설정하러가기
          </FailButton>
        </FailBox>
      )}
    </Group>
  );
}
const Group = styled.div`
  display: flex;
  height: 325px;
  gap: 24px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  flex: 0 0 auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;
  padding-left: 24px;
`;
const ShopImg = styled.img`
  width: 205px;
  height: 205px;
  flex-shrink: 0;
  border-radius: 12px 12px 0 0;
`;
const AiSuggestCard = styled.div`
  display: flex;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.1);
  width: 205px;
  height: 313px;
  flex-shrink: 0;
  flex-direction: column;

  &:hover {
    cursor: pointer;
  }
`;
const Explain = styled.div`
  display: flex;
  width: 167px;
  height: 86px;
  flex-shrink: 0;
  flex-direction: column;
  padding-left: 18px;
  padding-right: 20px;
  padding-top: 22px;
  gap: 17px;
`;
const ShopName = styled.p`
  display: flex;
  color: #141414;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 12px; /* 50% */
  letter-spacing: -0.2px;
  text-align: left;
  justify-content: space-between;
  max-width: 167px;
  margin: 0;
`;
const Hashtag = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr);
   grid-auto-flow: column;
  color: #5d5d5d;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.16px;
  text-align: left;
  max-width: 235px;
  margin: 0;
`;
const FailBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  width: 345px;
  height: 313px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.1);
`;
const FailText = styled.div`
  color: #141414;
  text-align: center;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 30px; /* 125% */
  letter-spacing: -1px;
  text-align: center;
`;
const FailButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 244px;
  height: 45px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #e8512a;

  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 30px; /* 214.286% */
  letter-spacing: -1px;

  &:hover {
    cursor: pointer;
  }
`;
