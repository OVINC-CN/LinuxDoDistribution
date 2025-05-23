import http from './index';
import globalContext from '../context';

export const getVCDetailAPI = (id) => new Promise((resolve, reject) => {
  http.get(`${globalContext.backendUrl}/virtual_content/${id}/`).then((res) => resolve(res), (err) => reject(err));
});

export const getVCReceiveHistoryAPI = (id, page, size) => new Promise((resolve, reject) => {
  http.get(`${globalContext.backendUrl}/virtual_content/${id}/receive_history/`, {params: {page, size}}).then((res) => resolve(res), (err) => reject(err));
});

export const receiveVCAPI = (id) => new Promise((resolve, reject) => {
  http.post(`${globalContext.backendUrl}/virtual_content/${id}/receive/`).then((res) => resolve(res), (err) => reject(err));
});

export const listReceiveHistoryAPI = (page, size) => new Promise((resolve, reject) => {
  http.get(`${globalContext.backendUrl}/virtual_content/receive_history/`, {params: {page, size}}).then((res) => resolve(res), (err) => reject(err));
});

export const listVCStatsAPI = () => new Promise((resolve, reject) => {
  http.get(`${globalContext.backendUrl}/virtual_content/stats/`).then((res) => resolve(res), (err) => reject(err));
});

export const listVCHistoryAPI = (page, size) => new Promise((resolve, reject) => {
  http.get(`${globalContext.backendUrl}/virtual_content/`).then((res) => resolve(res), (err) => reject(err));
});

export const deleteVCAPI = (id) => new Promise((resolve, reject) => {
  http.delete(`${globalContext.backendUrl}/virtual_content/${id}/`).then((res) => resolve(res), (err) => reject(err));
});

export const updateVCAPI = (id, data) => new Promise((resolve, reject) => {
  http.put(`${globalContext.backendUrl}/virtual_content/${id}/`, data).then((res) => resolve(res), (err) => reject(err));
});

export const createVCAPI = (data) => new Promise((resolve, reject) => {
  http.post(`${globalContext.backendUrl}/virtual_content/`, data).then((res) => resolve(res), (err) => reject(err));
});
