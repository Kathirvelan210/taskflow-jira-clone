import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("taskflow_user") || "null");
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  getMe: () => API.get("/auth/me"),
  updateProfile: (data) => API.put("/auth/profile", data),
  changePassword: (data) => API.put("/auth/change-password", data),
};

export const projectAPI = {
  getAll: () => API.get("/projects"),
  getById: (id) => API.get(`/projects/${id}`),
  create: (data) => API.post("/projects", data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  delete: (id) => API.delete(`/projects/${id}`),
  addMember: (id, email) => API.post(`/projects/${id}/members`, { email }),
  removeMember: (id, memberId) => API.delete(`/projects/${id}/members/${memberId}`),
};

export const taskAPI = {
  getByProject: (projectId, params = {}) => API.get("/tasks", { params: { projectId, ...params } }),
  create: (data) => API.post("/tasks", data),
  update: (id, data) => API.put(`/tasks/${id}`, data),
  delete: (id) => API.delete(`/tasks/${id}`),
};

export const sprintAPI = {
  getByProject: (projectId) => API.get("/sprints", { params: { projectId } }),
  create: (data) => API.post("/sprints", data),
  update: (id, data) => API.put(`/sprints/${id}`, data),
  delete: (id) => API.delete(`/sprints/${id}`),
};

export const commentAPI = {
  getByTask: (taskId) => API.get(`/tasks/${taskId}/comments`),
  add: (taskId, message) => API.post(`/tasks/${taskId}/comments`, { message }),
  delete: (taskId, commentId) => API.delete(`/tasks/${taskId}/comments/${commentId}`),
};
