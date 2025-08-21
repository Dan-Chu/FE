// shared/api/stamp.js
import api from "./api";

// 서버가 { data: ... }로 감싸든, 배열/객체를 바로 주든 흡수
const unwrap = (res) =>
  Array.isArray(res?.data) ? res.data : (res?.data?.data ?? res?.data);

/** 스탬프 전체 조회 **/
export const StampListGet = async () => {
  const res = await api.get("/stamps");           
  return unwrap(res) ?? [];
};

/** 스탬프 적립(인증코드 찍기) */
export const StampPlus = async (authCode) => {
  try {
    const code = String(authCode ?? "").trim();
    if (!code) return false;                      // 비어있으면 실패 처리
    const res = await api.post("/stamps", { authCode: code });
    return res.status >= 200 && res.status < 300;
  } catch (e) {
    console.error("[StampPlus] ", e?.response?.status, e?.response?.data);
    return false;
  }
};

/** 보상 수령(쿠폰 발급) **/
export const StampReward = async (stampId) => {
  try {
    const res = await api.post(`/stamps/${stampId}/use`, {});
    return res.status >= 200 && res.status < 300;
  } catch (e) {
    console.error("[StampReward] ", e?.response?.status, e?.response?.data);
    return false;
  }
};

/** 마감임박 스탬프(있으면) */
export const ExpiringStampGet = async () => {
  const res = await api.get("/stamps/expiring");
  return unwrap(res) ?? [];
};

/** 수령 결과 조회: GET /stamps/{stampId}/use */
export const StampUseGet = async (stampId) => {
  const res = await api.get(`/stamps/${stampId}/use`);
  return unwrap(res);
};
