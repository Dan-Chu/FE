import api from "./api";

export const TestLogin = async () => {
  try {
    const res = await api.post("/auth/login/test");
    const token = res.headers["authorization"]?.split(" ")[1];
    
    if (token) {
      localStorage.setItem("token", token);
      console.log("로그인 성공, 토큰 저장됨:", token);
      return true;  // 여기서 true 반환
    } else {
      console.error("토큰 없음");
      return false;
    }
  } catch (err) {
    console.error("로그인 실패", err);
    return false;
  }
};
