import axios from "axios";
import {jwtDecode}  from "jwt-decode";

function isTokenExpired(token) {
  if (!token) return true;
  const decoded = jwtDecode(token);
  const now = Date.now() / 1000;
  return decoded.exp < now;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 환경변수 사용
  withCredentials: true,//쿠키 주고받기
});

api.interceptors.request.use(async (config) => {
  let oldToken = localStorage.getItem("accessToken");

  if (config.url.includes("/auth/login/test")) {
    return config;
  }

  if (isTokenExpired(oldToken)) {
    // 만료 → refresh API 요청
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,{},{
      withCredentials: true,
    });
    const token = res.headers["authorization"]?.split(" ")[1];
    localStorage.setItem("accessToken", token);
    
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    config.headers.Authorization = `Bearer ${oldToken}`;
  }
  
  return config;
});

export default api;