import styled from "styled-components";
import Logo from "../../../assets/logos/card_logo.svg?react";
import { useNavigate } from "react-router-dom";

export default function StoreCard({ id, data, distance }) {
  const navigate = useNavigate();

  const toStoreDetail = () => {
    navigate(`/storeList/storeDetail/${id}`);
  };

  return (
    <Card onClick={() => toStoreDetail()}>
      <StoreImg src={data.mainImageUrl} />
      <TextBox>
        <StoreName>
          <Logo />
          {data.name}
        </StoreName>
        <HashtagBox>
          {data.hashtags && data.hashtags.length > 0 ? (
            data.hashtags.map((hashtag) => (
              <Hashtag key={hashtag.id}>{hashtag.name}</Hashtag>
            ))
          ) : (
            <p style={{ fontFamily: "Pretendard", fontSize: "14px" }}>
              태그가 없습니다.
            </p>
          )}
        </HashtagBox>
        {distance ? (
          <Distance>
            지금 위치에서 &nbsp;
            <span style={{ color: "#CF4721" }}>{distance}km</span>
            &nbsp; 거리에 있어요!
          </Distance>
        ) : (
          <Distance>거리를 보려면 위치정보를 허용해주세요.</Distance>
        )}
      </TextBox>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  width: 335px;
  height: 116px;
  flex-shrink: 0;
  background: #fff;
  border-bottom: 1px solid #d9d9d9;
  padding-left: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  gap: 24px;

  &:hover {
    cursor: pointer;
  }
`;
const StoreImg = styled.img`
  width: 115px;
  height: 115px;
  flex-shrink: 0;
  aspect-ratio: 1/1;
  border-radius: 12px;
  background: url(<path-to-image>) lightgray 50% / cover no-repeat;
`;
const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-top: 10px;
  padding-bottom: 10px;
`;
const StoreName = styled.div`
  display: flex;
  gap: 9px;
  align-items: center;
  color: #141414;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 0; /* 0% */
  letter-spacing: -1px;
  margin-bottom: auto;
`;
const HashtagBox = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;
const Hashtag = styled.div`
  display: flex;
  color: #5d5d5d;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 0; /* 0% */
  letter-spacing: -1px;
  height: 20px;
  align-items: center;
`;
const Distance = styled.div`
  display: flex;
  color: #5d5d5d;
  font-family: Pretendard;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 0; /* 0% */
  letter-spacing: -1px;
  height: 10px;
  align-items: center;
  margin-top: auto;
`;
