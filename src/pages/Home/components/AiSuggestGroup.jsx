import styled from "styled-components";

import ex_img from "../../../assets/images/example_shop_img.jpg";
import RightButton from "../../../assets/icons/right_button.svg?react";

export default function AiSuggestGroup() {
  return (
    <Group>
      <AiSuggestCard>
        <ShopImg src={ex_img} />
        <Explain>
          <ShopName>
            아맛나 떡볶이
            <RightButton />
          </ShopName>
          <Hashtag>
            #매콤달콤 <br />
            #분식
          </Hashtag>
        </Explain>
      </AiSuggestCard>
      <AiSuggestCard>
        <ShopImg src={ex_img} />
        <Explain>
          <ShopName>
            아맛나 떡볶이
            <RightButton />
          </ShopName>
          <Hashtag>
            #매콤달콤 <br />
            #분식
          </Hashtag>
        </Explain>
      </AiSuggestCard>
      <AiSuggestCard>
        <ShopImg src={ex_img} />
        <Explain>
          <ShopName>
            아맛나 떡볶이
            <RightButton />
          </ShopName>
          <Hashtag>
            #매콤달콤 <br />
            #분식
          </Hashtag>
        </Explain>
      </AiSuggestCard>
    </Group>
  );
}
const Group = styled.div`
  display: flex;
  height: 400px;
  gap: 30px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  flex: 0 0 auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;
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

