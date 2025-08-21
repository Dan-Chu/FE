// shared/api/coupon.js
import api from "./api";

// 쿠폰함 조회: GET /api/coupons
export const getCoupons = () => api.get("/coupons");

/**
 * 쿠폰 사용: POST /api/coupons/{couponID}/users
 * - 코드가 필요한 경우 body에 code(또는 Swagger 스키마 이름)로 전달
 */
export const useCoupon = (couponId, authCode) => {
  return api.post(`/coupons/${couponId}/use`, { authCode });
};
