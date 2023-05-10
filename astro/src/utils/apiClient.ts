import axios, { AxiosInstance } from 'axios';

export const axiosClient : AxiosInstance = axios.create({
    baseURL: import.meta.env.PUBLIC_API,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  axiosClient.interceptors.response.use(
    function (response) {
      return response.data;
    }, 
    function (error) : null {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('==> RESPONSE\n', error.response.data);
            console.log('==> RESPONSE HEADERS\n', error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
          console.log(error.config);
          return null;
    }
  );