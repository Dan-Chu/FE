import styled from "styled-components";
import { useState } from "react";

export default function FilterType() {
  const [type, setType] = useState(false);

  const typeOn = () => {
    setType(!type);
  };
  return (
    <Filter onClick={() => typeOn()} on={type}>
      해시태그
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
  background: ${({ on }) => (on ? "#E8512A" : "#FFF")};

  color: ${({ on }) => (on ? "#FFF" : "#E8512A")};
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
