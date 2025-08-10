import styled from "styled-components";
import TitleBar from "../../components/TitleBar";
import Search from "../../assets/icons/search.svg?react";
import LeftButton from "../../assets/icons/beforepage_button.svg?react";
import RightButton from "../../assets/icons/nextpage_button.svg?react";
import StoreCard from "./components/StoreCard";
import FilterIcon from "../../assets/icons/filter_icon.svg?react";
import { useState } from "react";

export default function StoreList() {
  const [page, setPage] = useState(1);

  const pageOn = (what) => {
    switch (what) {
      case 1:
        setPage(1);
        break;
      case 2:
        setPage(2);
        break;
      case 3:
        setPage(3);
        break;
      case 4:
        setPage(4);
        break;
    }
  };

  return (
    <Page>
      <TitleBar pageName="가게목록" />
      <SearchBar>
        <Input />
        <Search />
      </SearchBar>
      <Filter>
        <FilterIcon />
        필터
      </Filter>
      <ListBox>
        <StoreCard />
        <StoreCard />
        <StoreCard />
      </ListBox>
      <ListPage>
        <LeftButton />
        <PageNumber onClick={() => pageOn(1)} now={page == 1 ? 1 : 0}>
          1
        </PageNumber>
        <PageNumber onClick={() => pageOn(2)} now={page == 2 ? 1 : 0}>
          2
        </PageNumber>
        <PageNumber onClick={() => pageOn(3)} now={page == 3 ? 1 : 0}>
          3
        </PageNumber>
        <PageNumber onClick={() => pageOn(4)} now={page == 4 ? 1 : 0}>
          4
        </PageNumber>
        <RightButton />
      </ListPage>
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const SearchBar = styled.div`
  display: flex;
  width: 333px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 12px;
  border: 1px solid #d9d9d9;
  background: #fff;
  margin-left: 24px;
  align-items: center;
  padding-left: 10px;
`;
const Input = styled.input`
  width: 289px;
  outline: none;
  border: none;
`;
const Filter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 79px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #eaeaea;
  margin-left: auto;
  margin-right: 24px;

  color: #5d5d5d;
  text-align: center;
  font-family: Pretendard;
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  line-height: 30px; /* 272.727% */
  letter-spacing: -1px;
`;
const ListBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
`;
const ListPage = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  margin-left: 145px;
  margin-top: 10px;

  &:hover {
    cursor: pointer;
  }
`;
const PageNumber = styled.div`
  color: ${({ now }) => (now ? "#5D5D5D" : "#BDBDBD")};
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: ${({ now }) => (now ? "600" : "400")};
  line-height: 0; /* 0% */
  letter-spacing: -1px;
`;
