// shared/api/user.js
import api from "./api";

const unwrap = (res) => res?.data?.data ?? res?.data;

// 정보 조회
export const getUser = () => api.get("/users").then(unwrap);

// 정보 수정
export const updateUser = (formData) =>
  api.put("/users", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(unwrap);

// 로그아웃: refresh 쿠키 제거
export const logout = () =>
  api.post("/auth/logout", {}, { withCredentials: true });

// 회원 탈퇴
export const deleteUser = () => api.delete("/users");

export const CompleteMissionGet = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await api.get(`/users/missions/count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};