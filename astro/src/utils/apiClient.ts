import axios, { AxiosInstance } from "axios";

let baseURL = import.meta.env.PUBLIC_API
  ? import.meta.env.PUBLIC_API
  : "https://burnbookapi.zh0nb.com/";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const axiosClient: AxiosInstance = axios.create({
  baseURL: baseURL,
  headers: headers,
});

export const axiosClientNoIntercept: AxiosInstance = axios.create({
  baseURL: baseURL,
  headers: headers,
});

const axiosInterceptor = axiosClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error): null {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("==> RESPONSE HEADERS\n", error.response.headers);
      console.log("==> RESPONSE\n", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    return null;
  },
);
