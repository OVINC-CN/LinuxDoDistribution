import http from './index';

export const getUserInfoAPI = () => new Promise((resolve, reject) => {
  http.get('/account/oauth/user_info/').then((res) => resolve(res), (err) => reject(err));
});

export const getSignInUrlAPI = () => new Promise((resolve, reject) => {
  http.get('/account/oauth/login/').then((res) => resolve(res), (err) => reject(err));
});

export const signInAPI = (data) => new Promise((resolve, reject) => {
  http.post('/account/oauth/callback/', data).then((res) => resolve(res), (err) => reject(err));
});

export const signOutAPI = () => new Promise((resolve, reject) => {
  http.get('/account/sign_out/').then((res) => resolve(res), (err) => reject(err));
});
