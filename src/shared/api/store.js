import axios from "axios";
import { useState } from "react";

export const StoreListGet = ({ pageNumber }) => {
  const [data, setData] = useState([]);
  axios
    .get(`https://api.danchu.site/api/stores?page=${pageNumber}&size=3`)
    .then((res) => setData(res.data))
    .catch();

    return data;
};

export const StoreDetailGet = ({storeId}) => {
  const [data, setData] = useState([]);
  axios
    .get(`https://api.danchu.site/api/stores/${storeId}`)
    .then((res) => setData(res.data))
    .catch();

    return data;
};

export const SearchStoreGet = ({storeName}) => {
  const [data, setData] = useState([]);
  axios
    .get(`https://api.danchu.site/api/stores/search?keyword=${storeName}&page=0&size=3`)
    .then((res) => setData(res.data))
    .catch();

    return data;
};