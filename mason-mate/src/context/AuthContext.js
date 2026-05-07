import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Read from localStorage synchronously in useState initializer.
  // No useEffect needed — this eliminates the loading flicker that causes
  // the toggle loop between /login and /dashboard.
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  console.log("AuthContext init, token:", localStorage.getItem("token"));
  const [supervisor, setSupervisor] = useState(() => {
    try {
      const data = localStorage.getItem("supervisor");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });

  const login = (tokenValue, supervisorData) => {
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("supervisor", JSON.stringify(supervisorData));
    setToken(tokenValue);
    setSupervisor(supervisorData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("supervisor");
    setToken(null);
    setSupervisor(null);
  };

  // loading is always false — token/supervisor are ready synchronously.
  // Never set loading:true here, that's what caused the toggle loop.
  return (
    <AuthContext.Provider value={{ supervisor, token, loading: false, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }