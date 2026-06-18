import api from "../api/axios";

export function getActivities() {
  return api.get("/activities");
}

export function createActivity(payload) {
  return api.post("/activities", payload);
}

export function updateActivity(id, payload) {
  return api.put(`/activities/${id}`, payload);
}

export function deleteActivity(id) {
  return api.delete(`/activities/${id}`);
}

export default {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
};
