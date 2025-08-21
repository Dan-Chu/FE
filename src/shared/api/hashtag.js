// shared/api/hashtag.js
import { useState, useEffect } from "react";
import api from "./api";

export const HashtagsGet = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("/hashtags") // 인스턴스가 Authorization 자동 처리
      .then((res) => {
        const raw = res?.data?.data ?? res?.data ?? [];
        // 정렬 없이 백엔드 응답 순서를 그대로 사용
        setData(raw);
      })
      .catch((err) => console.error(err));
  }, []);

  return data;
};
