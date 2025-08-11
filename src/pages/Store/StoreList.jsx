import styled from "styled-components";
import TitleBar from "../../components/TitleBar";
import Search from "../../assets/icons/search.svg?react";
import LeftButton from "../../assets/icons/beforepage_button.svg?react";
import RightButton from "../../assets/icons/nextpage_button.svg?react";
import StoreCard from "./components/StoreCard";
import FilterIcon from "../../assets/icons/filter_icon.svg?react";
import Close from "../../assets/icons/close_button.svg?react";
import FilterType from "./components/filterType";
import { useState } from "react";

export default function StoreList() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(false);
  const pageCount = 1;

  const pageOn = (what) => {
    switch (what) {
      case 1:
        setPage(pageCount);
        break;
      case 2:
        setPage(pageCount + 1);
        break;
      case 3:
        setPage(pageCount + 2);
        break;
      case 4:
        setPage(pageCount + 3);
        break;
    }
  };

  const filterOn = () => {
    setFilter(!filter);
  };

  return (
    <Page>
      <TitleBar pageName="가게목록" />
      <SearchBar>
        <Input />
        <Search />
      </SearchBar>
      <Filter onClick={() => filterOn()}>
        <FilterIcon />
        필터
      </Filter>
      {filter && (
        <Modal>
          <ModalBox>
            <ModalHeader>
              필터
              <Close onClick={() => filterOn()} />
            </ModalHeader>
            <TypeBox>
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
              <FilterType />
            </TypeBox>
            <ApplyButton>적용하기</ApplyButton>
            <SwipeBar />
          </ModalBox>
        </Modal>
      )}
      <ListBox>
        <StoreCard />
        <StoreCard />
        <StoreCard />
      </ListBox>
      <ListPage>
        <LeftButton />
        <PageNumber onClick={() => pageOn(1)} now={page == pageCount ? 1 : 0}>
          {pageCount}
        </PageNumber>
        <PageNumber
          onClick={() => pageOn(2)}
          now={page == pageCount + 1 ? 1 : 0}
        >
          {pageCount + 1}
        </PageNumber>
        <PageNumber
          onClick={() => pageOn(3)}
          now={page == pageCount + 2 ? 1 : 0}
        >
          {pageCount + 2}
        </PageNumber>
        <PageNumber
          onClick={() => pageOn(4)}
          now={page == pageCount + 3 ? 1 : 0}
        >
          {pageCount + 3}
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

  &:hover {
    cursor: pointer;
  }
`;
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  z-index: 1000;
`;
const ModalBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 369px;
  height: 520px;
  flex-shrink: 0;
  border-radius: 12px 12px 0 0;
  background: #fff;
  box-shadow: 0 -4px 4px 0 rgba(0, 0, 0, 0.05);
  padding-top: 21px;
  padding-left: 24px;
  margin-top: auto;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 345px;

  color: #141414;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 30px; /* 166.667% */
  letter-spacing: -1px;
`;
const TypeBox = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 48px;
  margin-bottom: 28px;
  row-gap: 18px;
  width: 345px;
  height: 290px;
  overflow-x: hidden;
  overflow-y: auto;
  white-space: nowrap;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;
`;
const ApplyButton = styled.div`
  display: flex;
  width: 345px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #cf4721;
  align-items: center;
  justify-content: center;

  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 0; /* 0% */
  letter-spacing: -1px;

  &:hover {
    cursor: pointer;
  }
`;
const SwipeBar = styled.div`
  width: 140px;
  height: 6px;
  border-radius: 20px;
  background: #d9d9d9;
  margin-left: 103px;
  margin-top: auto;
  margin-bottom: 16px;
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
