import axios from "axios";

export default (method, url, data, params) => {

  const headers = {};
  if (localStorage.getItem("token")) {
    headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }

  const urls = {
    production: import.meta.env.VITE_API_URL_PROD,
    development: import.meta.env.VITE_API_URL_DEV,
    local: import.meta.env.VITE_API_URL,
  };
  console.log(headers)
  const apiUrl = urls[import.meta.env.VITE_ENV];

  return axios(apiUrl + url, {
    method: method,
    headers,
    data: data || "",
    params: params || "",
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
    
};
