import api from "../api/axios";

export async function register(data) {
  return api.post("/auth/register", data);
}

export async function login(data) {
  return api.post("/auth/login", data);
}

export async function logout(refreshToken) {
  return api.post("/auth/logout", { refreshToken });
}

export async function forgotPassword(email) {
  return api.post("/auth/forgot-password", { email });
}

export async function resetPassword(token, password) {
  return api.post("/auth/reset-password", { token, password });
}

export default {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
