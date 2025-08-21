import TitleBar from "../../components/TitleBar";
import Search from "../../assets/icons/search.svg?react";
import LeftButton from "../../assets/icons/beforepage_button.svg?react";
import RightButton from "../../assets/icons/nextpage_button.svg?react";
import StoreCard from "./components/StoreCard";
import FilterIcon from "../../assets/icons/filter_icon.svg?react";
import Close from "../../assets/icons/close_button.svg?react";
import Fail from "../../assets/icons/search_fail_icon.svg?react";
import FilterType from "./components/FilterType";
import {
  Page,
  SearchBar,
  Input,
  Filter,
  Modal,
  ModalBox,
  ModalHeader,
  TypeBox,
  ApplyButton,
  SwipeBar,
  ListBox,
  ListPage,
  PageNumber,
  SearchFail,
  FailText,
} from "./styles/ListStyle";
import { useEffect, useState } from "react";
import {
  StoreListGet,
  SearchStoreGet,
  FilterStoreGet,
} from "../../shared/api/store";
import { HashtagsGet } from "../../shared/api/hashtag";
import MyLocation from "./location";
import Loading from "../../components/Loading";

export default function StoreList() {
  const location = MyLocation();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [filter, setFilter] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [data, setData] = useState([]);
  const hashtags = HashtagsGet();
  const [selectFilter, setSelectFilter] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState(searchName);
  const [maxPage, setMaxPage] = useState();
  const [loading,setLoading]=useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchName);
    }, 500); // 0.5초 동안 입력 없을 때만 반영

    return () => {
      clearTimeout(handler); // 입력이 계속되면 이전 타이머 취소
    };
  }, [searchName]);

  useEffect(() => {
    const fetchData = async () => {
      let result;
      setLoading(true);
      if (!debouncedSearch) {
        // 검색어 없으면 그냥 기본 리스트
        
        if (!location.lat || !location.lng) return;
        result = await StoreListGet(page - 1, location.lat, location.lng);
        setData(result);
      } else if (debouncedSearch) {
        // 검색어 있으면 검색 API 호출
        if (!location.lat || !location.lng) return;
        result = await SearchStoreGet(
          debouncedSearch,
          page - 1,
          location.lat,
          location.lng
        );
        setData(result);
      } else {
        if (!location.lat || !location.lng) return;
        result = await FilterStoreGet(
          selectFilter,
          location.lat,
          location.lng,
          page - 1
        );
        setData(result);
      }
      setLoading(false);
      setMaxPage(result.totalPages);
    };

    fetchData();
  }, [page, debouncedSearch, location]);

  const search = async (name) => {
    if (!name) return;
    setPage(1);
    setSearchName(name);
  };

  const filterApply = async () => {
    setLoading(true);
    if (selectFilter.length > 0) {
      const result = await FilterStoreGet(
        selectFilter,
        location.lat,
        location.lng,
        page - 1
      );
      setData(result);
    } else {
      const result = await StoreListGet(0, location.lat, location.lng);
      setData(result);
    }
    setLoading(false);
    setMaxPage(data.totalPages);
  };

  const filterPlus = (hashtag) => {
    setSelectFilter((prev) => {
      // 이미 선택된 해시태그라면 제거
      if (prev.includes(hashtag.name)) {
        return prev.filter((item) => item !== hashtag.name);
      }
      return [...prev, hashtag.name];
    });
  };

  const filterOn = () => {
    setFilter(!filter);
  };

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

  const pageChange = (upDown) => {
    if (upDown) {
      if (pageCount + 4 <= maxPage) {
        setPageCount(pageCount + 4);
        setPage(pageCount + 4);
        return;
      }
      return;
    } else if (pageCount == 1) {
      return;
    }
    setPageCount(pageCount - 4);
    setPage(pageCount - 4);
  };

  return (
    <Page>
      <TitleBar pageName="가게목록" />
      <SearchBar>
        <Input
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search(searchName);
            }
          }}
        />
        <Search onClick={() => search(searchName)} />
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
              {hashtags && hashtags.length > 0 ? (
                hashtags.map((hashtag) => (
                  <FilterType
                    key={hashtag.id}
                    hashtag={hashtag.name}
                    selected={selectFilter.includes(hashtag.name)}
                    onClick={() => filterPlus(hashtag)}
                  />
                ))
              ) : (
                <p>필터가 없습니다.</p>
              )}
            </TypeBox>
            <ApplyButton
              onClick={() => {
                filterOn();
                filterApply();
              }}
            >
              적용하기
            </ApplyButton>
            <SwipeBar />
          </ModalBox>
        </Modal>
      )}
      <ListBox>
        {!loading ? (
          data.content && data.content.length > 0 ? (
          data.content.map((i) => (
            <StoreCard
              key={i.store.id}
              id={i.store.id}
              data={i.store}
              distance={i.distanceKm}
            />
          ))
        ) : (
          <SearchFail>
            <Fail />
            <FailText $color="#464646" $size="24px" $height="30px">검색결과가 없습니다.</FailText>
            <FailText $color="#5D5D5D" $size="14px" $height="24px">
              다른 검색어를 입력하시거나<br/>철자와 띄어쓰기를 확인해보세요.
            </FailText>
          </SearchFail>
        )
        ):<Loading/>}
      </ListBox>
      <ListPage>
        <LeftButton onClick={() => pageChange(false)} />
        <PageNumber onClick={() => pageOn(1)} $now={page == pageCount ? 1 : 0}>
          {pageCount}
        </PageNumber>
        {pageCount + 1 <= maxPage ? (
          <PageNumber
            onClick={() => pageOn(2)}
            $now={page == pageCount + 1 ? 1 : 0}
          >
            {pageCount + 1}
          </PageNumber>
        ) : (
          ""
        )}
        {pageCount + 2 <= maxPage ? (
          <PageNumber
            onClick={() => pageOn(3)}
            $now={page == pageCount + 2 ? 1 : 0}
          >
            {pageCount + 2}
          </PageNumber>
        ) : (
          ""
        )}
        {pageCount + 3 <= maxPage ? (
          <PageNumber
            onClick={() => pageOn(4)}
            $now={page == pageCount + 3 ? 1 : 0}
          >
            {pageCount + 3}
          </PageNumber>
        ) : (
          ""
        )}
        <RightButton onClick={() => pageChange(true)} />
      </ListPage>
    </Page>
  );
}
