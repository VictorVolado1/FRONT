import axios from "axios";

export default (method, url, data, params = {}, options = {}) => {

  const headers = {};
  if (localStorage.getItem("token")) {
    headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }

  const urls = {
    production: import.meta.env.VITE_API_URL_PROD,
    development: import.meta.env.VITE_API_URL_DEV,
    local: import.meta.env.VITE_API_URL,
  };

  const apiUrl = urls[import.meta.env.VITE_ENV];

  return axios(apiUrl + url, {
    method: method,
    headers,
    data: data || "",
    params: params || "",
    responseType: options.responseType || 'json',
  })
    .then((response) => {
      if (options.responseType === 'blob') {
        return {
          data: response.data,
          headers: response.headers,
        };
      }
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
    
};