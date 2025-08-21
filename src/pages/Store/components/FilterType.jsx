import styled from "styled-components";
import { useEffect, useState } from "react";

export default function FilterType({ hashtag, selected, onClick }) {
  const [onType, setOnType] = useState(selected);

  // 부모에서 props로 내려주는 selected 값이 변하면 동기화
  useEffect(() => {
    setOnType(selected);
  }, [selected]);

  const handleClick = () => {
    // 내부 상태 토글
    setOnType((prev) => !prev);
    // 부모에게 알림
    onClick(hashtag);
  };

  return (
    <Filter onClick={handleClick} $on={onType}>
      {hashtag}
    </Filter>
  );
}

const Filter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 31px;
  flex-shrink: 0;
  border-radius: 18px;
  border: 1px solid #e8512a;
  background: ${({ $on }) => ($on ? "#E8512A" : "#FFF")};

  color: ${({ $on }) => ($on ? "#FFF" : "#E8512A")};
  text-align: center;
  font-family: Pretendard;
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  line-height: 0; /* 0% */
  letter-spacing: -1px;

  &:hover {
    cursor: pointer;
  }
`;
