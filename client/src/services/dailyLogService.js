import api from "../api/axios";

export function getLogs() {
  return api.get("/logs").then((res) => {
    console.log("GET /logs response:", res.data);
    return res;
  });
}

export function getTodayLogs() {
  return api.get("/logs/today").then((res) => {
    console.log("GET /logs/today response:", res.data);
    return res;
  });
}

export function createLog(payload) {
  console.log("Toggle Payload:", payload);
  return api.post("/logs", payload);
}

export function updateLog(id, payload) {
  console.log("Update Log Payload:", id, payload);
  return api.put(`/logs/${id}`, payload);
}

export function deleteLog(id) {
  return api.delete(`/logs/${id}`);
}

export default { getLogs, createLog, updateLog, deleteLog };
