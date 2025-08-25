// shared/api/stamp.js
import api from "./api";

const unwrap = (res) =>
  Array.isArray(res?.data) ? res.data : res?.data?.data ?? res?.data;

/** 보상 수령(쿠폰 발급) — POST /stamps/{stampId}/use */
export const StampReward = async (stampId) => {
  try {
    // 토큰 인터셉터가 있다면 cfg는 생략 가능
    const token = localStorage.getItem("accessToken");
    const cfg = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;

    const res = await api.post(`/stamps/${encodeURIComponent(stampId)}/use`, {}, cfg);
    // 필요하면 data 반환형으로 바꿔 써도 됩니다.
    return res.status >= 200 && res.status < 300; // boolean
    // 혹은:
    // return { ok: res.status >= 200 && res.status < 300, status: res.status, data: unwrap(res) };
  } catch (e) {
    console.error("[StampReward]", e?.response?.status, e?.response?.data);
    return false; // 위 주석 버전이면 { ok:false, status:..., data:null } 형태로
  }
};

/** 스탬프 전체 조회 **/
export const StampListGet = async () => {
  const res = await api.get("/stamps");
  return unwrap(res) ?? [];
};

/** 스탬프 적립(인증코드 찍기) */
export const StampPlus = async (authCode) => {
  try {
    const code = String(authCode ?? "").trim();
    if (!code) return { ok: false, status: 400, data: null };
    const res = await api.post("/stamps", { code, authCode: code });
    return { ok: res.status >= 200 && res.status < 300, status: res.status, data: unwrap(res) };
  } catch (e) {
    console.error("[StampPlus]", e?.response?.status, e?.response?.data);
    return { ok: false, status: e?.response?.status ?? 500, data: e?.response?.data ?? null };
  }
};

/** (참고로 남김) 마감임박 스탬프 */
export const ExpiringStampGet = async () => {
  const res = await api.get("/stamps/expiring");
  return unwrap(res) ?? [];
};

/** ✅ 보상 수령(쿠폰 발급) — POST /stamps/{stampId}/use */
export const StampUse = async (stampId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const cfg = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;

    const path = `/stamps/${encodeURIComponent(stampId)}/use`;
    // 디버그 도움
    console.debug("[StampUse] POST", path, "token?", !!token);

    const res = await api.post(path, {}, cfg);
    return { ok: res.status >= 200 && res.status < 300, status: res.status, data: unwrap(res) };
  } catch (e) {
    console.error("[StampUse]", e?.response?.status, e?.response?.data);
    return { ok: false, status: e?.response?.status ?? 0, data: e?.response?.data ?? null };
  }
};

