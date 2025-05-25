import http from './index';

export const getVCDetailAPI = (id) => new Promise((resolve, reject) => {
  http.get(`/virtual_content/${id}/`).then((res) => resolve(res), (err) => reject(err));
});

export const getVCReceiveHistoryAPI = (id, page, size) => new Promise((resolve, reject) => {
  http.get(`/virtual_content/${id}/receive_history/`, {params: {page, size}}).then((res) => resolve(res), (err) => reject(err));
});

export const receiveVCAPI = (id, data) => new Promise((resolve, reject) => {
  http.post(`/virtual_content/${id}/receive/`, data).then((res) => resolve(res), (err) => reject(err));
});

export const listReceiveHistoryAPI = (page, size) => new Promise((resolve, reject) => {
  http.get(`/virtual_content/receive_history/`, {params: {page, size}}).then((res) => resolve(res), (err) => reject(err));
});

export const listVCStatsAPI = () => new Promise((resolve, reject) => {
  http.get(`/virtual_content/stats/`).then((res) => resolve(res), (err) => reject(err));
});

export const listVCHistoryAPI = (page, size) => new Promise((resolve, reject) => {
  http.get(`/virtual_content/`).then((res) => resolve(res), (err) => reject(err));
});

export const deleteVCAPI = (id) => new Promise((resolve, reject) => {
  http.delete(`/virtual_content/${id}/`).then((res) => resolve(res), (err) => reject(err));
});

export const updateVCAPI = (id, data) => new Promise((resolve, reject) => {
  http.put(`/virtual_content/${id}/`, data).then((res) => resolve(res), (err) => reject(err));
});

export const createVCAPI = (data) => new Promise((resolve, reject) => {
  http.post(`/virtual_content/`, data).then((res) => resolve(res), (err) => reject(err));
});
