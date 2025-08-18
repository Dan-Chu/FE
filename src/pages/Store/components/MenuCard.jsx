import styled from "styled-components";

export default function MenuCard({key,data}) {
  return (
    <Card>
      <TextBox>
        <MenuName>{data.name}</MenuName>
        <Price>{data.priceFormatted}</Price>
      </TextBox>
      <MenuImg src={data.imageUrl} />
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  padding-top: 15px;
  padding-bottom: 15px;
  padding-right: 22px;
  padding-left: 30px;
  border-bottom: 1px solid #EAEAEA;
`;
const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  justify-content: center;
`;
const MenuName = styled.div`
  color: #141414;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 0; /* 0% */
  letter-spacing: -1px;
`;
const Price = styled.div`
  color: #5d5d5d;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 0; /* 0% */
  letter-spacing: -1px;
`;
const MenuImg = styled.img`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  aspect-ratio: 1/1;
  border-radius: 12px;
  background: url(<path-to-image>) lightgray 50% / cover no-repeat;
  margin-left: auto;
`;
