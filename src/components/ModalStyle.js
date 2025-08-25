import styled from "styled-components";

export const CodeMadal = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  width: 326px;
  height: 299px;
  border-radius: 15px;
  background: #fff;
  position: relative;
`;
export const Close = styled.div`
  margin-left: auto;
`;
export const HeadText = styled.div`
  color: #ce4927;
  text-align: center;
  font-family: Pretendard;
  font-size: ${({ $size }) => $size};
  font-style: normal;
  font-weight: ${({ $weight }) => $weight};
  line-height: 20px; /* 125% */
  letter-spacing: -1px;
`;
export const TestText = styled.div`
  color: #797979;
  text-align: center;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 15px; /* 0% */
  letter-spacing: -1px;
`;
export const InputBox = styled.div`
  display: flex;
  margin-right: auto;
  width: 320px;
  padding-left: 20px;
`;
export const Input = styled.input`
  border: none;
  color: #141414;
  text-align: center;
  font-family: Pretendard;
  font-size: 45px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 44.444% */
  letter-spacing: -0.5px;
  width: 150px;

  &::placeholder {
    color: #eaeaea;
    font-family: Pretendard;
    font-size: 45px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px; /* 44.444% */
    letter-spacing: -0.5px;
  }
`;
export const Check = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 326px;
  height: 56px;
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 0 0 0 12px;
  border: 1px solid #ce4927;
  background: #ce4927;

  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 25px;
  font-style: normal;
  font-weight: 500;
  line-height: 0; /* 0% */
  letter-spacing: -0.5px;
`;
export const ModalImg=styled.div`
display: flex;
width: 126px;
height: 126px;
aspect-ratio: 1/1;
border-radius: 12px;
background: #EAEAEA url(<path-to-image>) no-repeat center / cover;
margin-top: 15px;
justify-content: center;
align-items: center;
`
