import { createContext, useContext, useState } from 'react';
import { useDB } from './../context/DbContext.jsx';

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const { getUser, getUserByCredentials } = useDB();
  const [user, setUser] = useState(null);

  const login = async (username, password) => {

    const user = await getUserByCredentials(username, password);

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
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