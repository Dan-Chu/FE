import api from "./api";

export const AiStoreGet = async () => {//위치 기반 리스트
  const token = localStorage.getItem("accessToken");
  const res = await api.get(`/openai/stores/recommend`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};
