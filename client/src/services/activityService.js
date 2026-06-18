import api from "../api/axios";

export function getActivities() {
  return api.get("/activities").then((res) => {
    console.log("GET /activities response:", res.data);
    return res;
  });
}

export function getActivitiesByTab(tabId) {
  return api.get(`/activities/tab/${tabId}`).then((res) => {
    console.log(`GET /activities/tab/${tabId} response:`, res.data);
    return res;
  });
}

export function createActivity(payload) {
  console.log("Activity Create Payload:", payload);
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
