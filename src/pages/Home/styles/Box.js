import styled from "styled-components";

export const Group = styled.div`
  display: flex;
  gap: 24px;
  flex-direction: column;
`;
export const TextBox = styled.div`
display: flex;
width: 345px;
height: 30px;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;
export const Text = styled.div`
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 30px;
  text-align: left;
`;
export const Button = styled.div`
  color: #5a5757;
  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.14px;
`;