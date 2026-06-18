import api from "../api/axios";

export function getTabs() {
  return api.get("/tabs");
}

export function createTab(payload) {
  return api.post("/tabs", payload);
}

export function updateTab(id, payload) {
  return api.put(`/tabs/${id}`, payload);
}

export function deleteTab(id) {
  return api.delete(`/tabs/${id}`);
}

export default { getTabs, createTab, updateTab, deleteTab };
