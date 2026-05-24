import { createContext, useContext, useState } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("taskflow_user") || "null")
  );

  const persist = (data) => {
    localStorage.setItem("taskflow_user", JSON.stringify(data));
    setUser(data);
  };

  const login = async (data) => {
    const res = await authAPI.login(data);
    persist(res.data);
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    persist(res.data);
  };

  const updateUser = (data) => persist({ ...user, ...data });

  const logout = () => {
    localStorage.removeItem("taskflow_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
