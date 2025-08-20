import api from "./api";

export const StampListGet = async () => {//스탬프 전체 조회
  const token = localStorage.getItem("accessToken");
  const res = await api.get(`/stamps`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};

export const StampPlus = async (authCode) => {//스탬프 추가
  const token = localStorage.getItem("accessToken");
  try {
    const res=await api.post(
      `/stamps/`,
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
    console.error("Stamp complete error:", error);
    return false
  }
};

export const StampReward = async (id) => {//스탬프 수령
  const token = localStorage.getItem("accessToken");
  try {
    const res=await api.post(
      `/stamps/${id}/use`,
      {}, // body가 없으면 빈 객체
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
    console.error("Stamp complete error:", error);
    return false
  }
};

export const ExpiringStampGet = async () => {//마감임박 스탬프
  const token = localStorage.getItem("accessToken");
  const res = await api.get(`/stamps/expiring`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};