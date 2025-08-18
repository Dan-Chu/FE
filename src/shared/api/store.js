import api from "./api";

export const StoreListGet = async (pageNumber,lat,lng) => {//위치 기반 리스트
  const token = localStorage.getItem("token");
  const res = await api.get(`/stores/nearby?lat=${lat}&lng=${lng}&page=${pageNumber}&size=3`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data.content;
};

export const StoreDetailGet = async (storeId) => {
  const token = localStorage.getItem("token");
  const res = await api.get(`/stores/${storeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};

export const SearchStoreGet = async (storeName, pageNumber) => {
  const token = localStorage.getItem("token");
  const res = await api.get(
    `/stores/search?keyword=${storeName}&page=${pageNumber}&size=3`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.data.content;
};

export const FilterStoreGet = async (tags) => {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams();
  tags.forEach((tag) => params.append("tags", tag));
  params.append("page", 0);
  params.append("size", 3);
  const res = await api.get(`/stores/filter?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data.content;
};
