import api from "../api/axios";

export function getDashboard() {
  return api.get("/admin/dashboard").then((res) => {
    console.log("GET /admin/dashboard response:", res.data);
    return res;
  });
}

export function getUsers() {
  return api.get("/admin/users").then((res) => {
    console.log("GET /admin/users response:", res.data);
    return res;
  });
}

export function getAuditLogs() {
  return api.get("/admin/audit-logs").then((res) => {
    console.log("GET /admin/audit-logs response:", res.data);
    return res;
  });
}

export function getStats() {
  return api.get("/admin/stats").then((res) => {
    console.log("GET /admin/stats response:", res.data);
    return res;
  });
}

export default { getDashboard, getUsers, getAuditLogs, getStats };
