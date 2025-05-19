// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { useDB } from './../context/DbContext.jsx'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const { getUserByCredentials, loading } = useDB()

  // 1) Hydrate from localStorage
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  // 2) (Optional) Once DB is ready, you can re-validate the stored user
  useEffect(() => {
    if (!loading && user) {
      // e.g. verify the user still exists in the DB
      getUserByCredentials(user.username, user.password)
        .then(fresh => {
          if (!fresh) logout()   // or clear invalid cache
        })
        .catch(() => logout())
    }
  }, [loading])

  const login = async (username, password) => {
    const found = await getUserByCredentials(username, password)
    if (found) {
      localStorage.setItem('user', JSON.stringify(found))
      setUser(found)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
