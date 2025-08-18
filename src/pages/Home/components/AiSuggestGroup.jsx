import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import RightButton from "../../../assets/icons/right_button.svg?react";

export default function AiSuggestGroup(data) {
  const navigate = useNavigate();

  const toStoreDetail = (id) => {
    navigate(`/storeList/storeDetail/${id}`);
  };
  return (
    <Group>
      {data && data.length > 0 ? (
        data.map((store) => (
          <AiSuggestCard onClick={() => toStoreDetail(store.id)}>
            <ShopImg src={store.mainImageUrl} />
            <Explain>
              <ShopName>
                {store.name}
                <RightButton />
              </ShopName>
              <Hashtag>
                {store.hashtags && store.hashtags.length > 0 ? (
                  store.hashtags.map((tags) => {
                    tags.name;
                  })
                ) : (
                  <p>태그가 없습니다.</p>
                )}
              </Hashtag>
            </Explain>
          </AiSuggestCard>
        ))
      ) : (
        <p>사용자 해시태그가 없어<br/>추천을 진행할 수 없습니다.</p>
      )}
    </Group>
  );
}
const Group = styled.div`
  display: flex;
  height: 400px;
  gap: 34px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  flex: 0 0 auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;
  padding-left: 60px;
`;
const ShopImg = styled.img`
  width: 271.789px;
  height: 244px;
  flex-shrink: 0;
  border-radius: 12px 12px 0 0;
`;
const AiSuggestCard = styled.div`
  display: flex;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.5);
  width: 272px;
  height: 368px;
  flex-shrink: 0;
  flex-direction: column;

  &:hover {
    cursor: pointer;
  }
`;
const Explain = styled.div`
  display: flex;
  width: 272px;
  height: 124px;
  flex-shrink: 0;
  flex-direction: column;
  padding-left: 19px;
  padding-right: 28px;
  padding-top: 27px;
  gap: 18px;
`;
const ShopName = styled.p`
  display: flex;
  color: #141414;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 12px; /* 50% */
  letter-spacing: -0.24px;
  text-align: left;
  justify-content: space-between;
  max-width: 235px;
  margin: 0;
`;
const Hashtag = styled.p`
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
