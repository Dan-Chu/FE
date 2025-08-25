import api from "./api";

const unwrap = (res) => res?.data?.data ?? res?.data;

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

// export const MissionComplete = async (code, authCode) => {
//   const token = localStorage.getItem("accessToken");
//   try {
//     const res = await api.post(
//       `/missions/${code}/complete`,
//       { authCode }, // body가 없으면 빈 객체
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     if (res.status === 200) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     console.error("Mission complete error:", error);
//     return false;
//   }
// };

// 스웨거: POST /missions/{missionId}/complete, body: { authCode }
export const MissionComplete = async ({ missionId, authCode }) => {
  const token = localStorage.getItem("accessToken");
  try {
    const res = await api.post(
      `/missions/${missionId}/complete`,
      { authCode },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      ok: res.status >= 200 && res.status < 300,
      status: res.status,
      data: unwrap(res),
    };
  } catch (error) {
    const status = error?.response?.status ?? 500;
    console.error("Mission complete error:", status, error?.response?.data);
    return { ok: false, status, data: error?.response?.data ?? null };
  }
};
