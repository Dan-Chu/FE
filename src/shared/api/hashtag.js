import { useState, useEffect } from "react";
import api from "./api";

export const HashtagsGet = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    api
      .get(`/hashtags`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setData(res.data.data))
      .catch((err) => console.error(err));
  },[]);
  return data;
};
