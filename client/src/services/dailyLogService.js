import api from "../api/axios";

export function getLogs() {
  return api.get("/logs");
}

export function createLog(payload) {
  return api.post("/logs", payload);
}

export function updateLog(id, payload) {
  return api.put(`/logs/${id}`, payload);
}

export function deleteLog(id) {
  return api.delete(`/logs/${id}`);
}

export default { getLogs, createLog, updateLog, deleteLog };
