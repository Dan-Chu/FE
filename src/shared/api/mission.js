import api from "./api";

export const PopularMissionGet = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await api.get(`/missions/popular`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};

export const MissionListGet = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await api.get(`/missions/today`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};

export const MissionDetailGet = async (id) => {
  const token = localStorage.getItem("accessToken");
  const res = await api.get(`/missions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};

export const MissionComplete = async (code,authCode) => {
  const token = localStorage.getItem("accessToken");
  try {
    const res=await api.post(
      `/missions/${code}/complete`,
      {authCode}, // body가 없으면 빈 객체
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if(res.status===200){
      return true;
    } else{
      return false;
    }
  } catch (error) {
    console.error("Mission complete error:", error);
    return false
  }
};