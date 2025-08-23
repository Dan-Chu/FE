import api from "./api";

export const StoreListGet = async (pageNumber,lat,lng) => {//위치 기반 리스트
  const token = localStorage.getItem("accessToken");
  const res = await api.get(`/stores/nearby?lat=${lat}&lng=${lng}&page=${pageNumber}&size=3`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};

export const StoreDetailGet = async (storeId) => {
  const token = localStorage.getItem("accessToken");
  const res = await api.get(`/stores/${storeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};

export const SearchStoreGet = async (storeName, pageNumber,lat,lng) => {
  const token = localStorage.getItem("accessToken");
  const res = await api.get(
    `/stores/search?keyword=${storeName}&lat=${lat}&lng=${lng}&page=${pageNumber}&size=3`,
    `/stores/search?keyword=${storeName}&lat=${lat}&lng=${lng}&page=${pageNumber}&size=3`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.data;
};


export const FilterStoreGet = async (tags,lat,lng,page) => {
  const token = localStorage.getItem("accessToken");
  const params = new URLSearchParams();
  tags.forEach((tag) => params.append("tags", tag));
  params.append("lat", lat);
  params.append("lng", lng);
  params.append("page", page);
  params.append("lat", lat);
  params.append("lng", lng);
  params.append("page", page);
  params.append("size", 3);
  const res = await api.get(`/stores/filter?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};