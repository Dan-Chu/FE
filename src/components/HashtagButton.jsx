import styled from "styled-components";

/** 해시태그 토글 버튼 (상태는 부모가 관리)
 *  props:
 *   - on: boolean (선택됨)
 *   - children: 버튼 텍스트 (기본 '# 해시태그')
 */
export default function HashtagButton({ on = false, children = "해시태그", ...props }) {
  return (
    <Btn type="button" $on={on} {...props}>
      # {children}
    </Btn>
  );
}

const Btn = styled.button`
  min-width: 78px;          
  height: 31px;
  padding: 0 12px;
  border-radius: 18px;
  border: 1px solid #e8512a;
  background: ${({ $on }) => ($on ? "#e8512a" : "#fff")};
  color: ${({ $on }) => ($on ? "#fff" : "#e8512a")};
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  line-height: 31px;
  cursor: pointer;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px #ff5a2f33;
  }
`;
