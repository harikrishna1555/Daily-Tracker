import api from "../api/axios";

export function getTabs() {
  return api.get("/tabs").then((res) => {
    console.log("GET /tabs response:", res.data);
    return res;
  });
}

export function getTab(id) {
  return api.get(`/tabs/${id}`).then((res) => {
    console.log(`GET /tabs/${id} response:`, res.data);
    return res;
  });
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
