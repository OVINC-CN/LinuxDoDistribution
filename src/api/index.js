import axios from 'axios';
import globalContext from '../context';

const http = axios;

http.defaults.timeout = 10000;
http.defaults.baseURL = globalContext.backendUrl;
http.defaults.withCredentials = true;

http.interceptors.response.use((res) => res.data, (err) => {
  // 401 redirect to log in
  if (err.response.status === 401) {
    // check code
    const url = new URL(window.location.href);
    if ((url.searchParams.has('code') && url.searchParams.has('state')) || (url.searchParams.has('doLogin'))) {
      return Promise.reject(err);
    }
    // redirect to log in
    window.location.href = `${globalContext.siteUrl}/oauth/login/?doLogin=1`;
    return;
  }
  return Promise.reject(err);
});

export default http;
