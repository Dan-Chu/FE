import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
export const SearchBar = styled.div`
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
export const Input = styled.input`
  width: 289px;
  outline: none;
  border: none;
`;
export const Filter = styled.div`
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
export const Modal = styled.div`
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
export const ModalBox = styled.div`
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
export const ModalHeader = styled.div`
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
export const TypeBox = styled.div`
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
export const ApplyButton = styled.div`
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
export const SwipeBar = styled.div`
  width: 140px;
  height: 6px;
  border-radius: 20px;
  background: #d9d9d9;
  margin-left: 103px;
  margin-top: auto;
  margin-bottom: 16px;
`;
export const ListBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
  height: 460px;
`;
export const ListPage = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  width: fit-content; /* 필요한 만큼만 차지 */
  margin: 0; /* 기존 margin 제거 */

  &:hover {
    cursor: pointer;
  }
`;
export const PageNumber = styled.div`
  color: ${({ $now }) => ($now ? "#5D5D5D" : "#BDBDBD")};
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: ${({ $now }) => ($now ? "600" : "400")};
  line-height: 0; /* 0% */
  letter-spacing: -1px;
`;
export const SearchFail = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 130px;
`;
export const FailText = styled.div`
  color: ${({ $color }) => $color};
  text-align: center;
  font-family: Pretendard;
  font-size: ${({ $size }) => $size};
  font-style: normal;
  font-weight: 500;
  line-height: ${({ $height }) => $height};
  letter-spacing: -1px;
`;
