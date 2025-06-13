import http from './index';

export const getTCaptchaConfigAPI = (params) => new Promise((resolve, reject) => {
  http.get('/tcaptcha/config/', {params}).then((res) => resolve(res), (err) => reject(err));
});
