import TitleBar from "../../components/TitleBar";
import Search from "../../assets/icons/search.svg?react";
import BeforeButton from "../../assets/icons/beforepage_button.svg?react";
import NextButton from "../../assets/icons/nextpage_button.svg?react";
import RightButton from "../../assets/icons/page_plus4.svg?react";
import LeftButton from "../../assets/icons/page_minus4.svg?react";
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
import { useEffect, useState, useCallback } from "react";
import {
  StoreListGet,
  SearchStoreGet,
  FilterStoreGet,
  NoneDistanceListGet,
} from "../../shared/api/store";
import { HashtagsGet } from "../../shared/api/hashtag";
import MyLocation from "./location";
import Loading from "../../components/Loading";
import { motion as Motion, AnimatePresence } from "framer-motion";

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
  const [loading, setLoading] = useState(null);
  const [dataSize, setDataSize] = useState(0);
  const [listEl, setListEl] = useState(null); // DOM 노드 보관

  const listRef = useCallback((node) => {
    //콜백 ref: DOM에 붙는 순간 node가 들어옴
    setListEl(node); // mount 시 node, unmount 시 null
  }, []);

  useEffect(() => {
    if (!listEl) return;

    const compute = () => {
      const h = listEl.getBoundingClientRect().height;
      setDataSize(Math.max(1, Math.floor(h / 146))); // 최소 1 보정
    };

    compute(); // 최초 1회 측정

    const ro = new ResizeObserver(compute); // 크기 변화 추적
    ro.observe(listEl);

    window.addEventListener("resize", compute); // 윈도우 리사이즈도 추적(선택)

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [listEl]);

  useEffect(() => {
    //디바운싱 검색어 변환 및 적용
    const handler = setTimeout(() => {
      setDebouncedSearch(searchName);
    }, 500); // 0.5초 동안 입력 없을 때만 반영

    return () => {
      clearTimeout(handler); // 입력이 계속되면 이전 타이머 취소
    };
  }, [searchName]);

  useEffect(() => {
    //페이지, 검색어 변환에 따라 데이터 적용
    const fetchData = async () => {
      if (!dataSize) return;
      let result;
      setLoading(true);
      if (location.lat && location.lng) {
        if (!debouncedSearch) {
          // 검색어 없으면 그냥 기본 리스트
          result = await StoreListGet(
            page - 1,
            location.lat,
            location.lng,
            dataSize
          );
          setData(result);
        } else if (debouncedSearch) {
          // 검색어 있으면 검색 API 호출
          result = await SearchStoreGet(
            debouncedSearch,
            page - 1,
            location.lat,
            location.lng,
            dataSize
          );
          setData(result);
        } else {
          result = await FilterStoreGet(
            selectFilter,
            location.lat,
            location.lng,
            page - 1,
            dataSize
          );
          setData(result);
        }
      } else {
        result = await NoneDistanceListGet(page - 1, dataSize);
        setData(result);
      }
      setLoading(false);
      setMaxPage(result.totalPages);
    };

    fetchData();
  }, [page, debouncedSearch, location, dataSize]);

  const search = async (name) => {
    //화면에 검색어 보여줌
    if (!name) return;
    setPage(1);
    setSearchName(name);
  };

  const filterApply = async () => {
    //필터 적용하여 데이터 산출
    let result;
    setPage(1);
    setLoading(true);
    if (selectFilter.length > 0) {
      result = await FilterStoreGet(
        selectFilter,
        location.lat,
        location.lng,
        page - 1,
        dataSize
      );
      setData(result);
    } else {
      result = await StoreListGet(0, location.lat, location.lng, dataSize);
      setData(result);
    }
    setLoading(false);
    setMaxPage(result.totalPages);
  };

  const filterPlus = (hashtag) => {
    //필터에 해시태그 추가
    setSelectFilter((prev) => {
      // 이미 선택된 해시태그라면 제거
      if (prev.includes(hashtag.name)) {
        return prev.filter((item) => item !== hashtag.name);
      }
      return [...prev, hashtag.name];
    });
  };

  const pageOn = (what) => {
    //현재 페이지 보여주기
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
    //페이지네이션 숫자 변환
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
  const pagePlus = (upDown) => {//다음페이지
    if(upDown) {
      if(page== maxPage) return;
      if(page+1 == pageCount+4){
        setPageCount(pageCount+4);
        setPage(page+1);
      } else {
          setPage(page + 1);
      }
      }
    else {
      if(page==1) return;
      if(page == pageCount){
          setPageCount(pageCount-4);
          setPage(page-1);
      } else{
        setPage(page-1);
      }
      }
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
      <Filter onClick={() => setFilter(true)}>
        <FilterIcon />
        필터
      </Filter>
      <AnimatePresence mode="wait">
        {filter && (
          <Modal>
            <Motion.div
              key="filter-modal"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ModalBox>
                <ModalHeader>
                  필터
                  <Close onClick={() => setFilter(false)} />
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
                    setFilter(false);
                    filterApply();
                  }}
                >
                  적용하기
                </ApplyButton>
                <SwipeBar />
              </ModalBox>
            </Motion.div>
          </Modal>
        )}
      </AnimatePresence>
      <ListBox ref={listRef}>
        {/*listRef에 노드 전달*/}
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
              <FailText $color="#464646" $size="24px" $height="30px">
                검색결과가 없습니다.
              </FailText>
              <FailText $color="#5D5D5D" $size="14px" $height="24px">
                다른 검색어를 입력하시거나
                <br />
                철자와 띄어쓰기를 확인해보세요.
              </FailText>
            </SearchFail>
          )
        ) : (
          <Loading />
        )}
      </ListBox>
      <ListPage>
        <LeftButton onClick={() => pageChange(false)} />
        <BeforeButton onClick={() => pagePlus(false)} />
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
        <NextButton onClick={() => pagePlus(true)} />
        <RightButton onClick={() => pageChange(true)} />
      </ListPage>
    </Page>
  );
}
