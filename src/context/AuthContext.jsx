import { createContext, useContext, useState } from 'react';
import { useConfig } from '../context/ConfigContext.jsx';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { dbUrl } = useConfig();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  const login = async (username, password) => {
    const res = await fetch(`${dbUrl}/users?username=${username}&password=${password}`);
    const data = await res.json();
    if (data.length > 0) {
      localStorage.setItem('user', JSON.stringify(data[0]));
      setUser(data[0]);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);