import api from "../api/axios";

export function getDashboard() {
  return api.get("/admin/dashboard");
}

export function getUsers() {
  return api.get("/admin/users");
}

export function getAuditLogs() {
  return api.get("/admin/audit-logs");
}

export function getStats() {
  return api.get("/admin/stats");
}

export default { getDashboard, getUsers, getAuditLogs, getStats };
