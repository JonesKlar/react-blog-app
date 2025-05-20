import { useState } from 'react'
import { Link } from 'react-router'
import { FiMenu, FiX } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext.jsx'

export default function Header() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <nav className="navbar bg-base-100 shadow-md mb-4 relative">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost md:text-xl">
          Mein Blog
        </Link>
      </div>

      {/* Desktop Menu: flex by default, hidden on screens ≤480px */}
      <div className="flex-none flex max-[480px]:hidden">
        <ul className="menu menu-horizontal px-1">
          {user?.username === 'admin' && (
            <li>
              <Link to="/admin/comments">Kommentare</Link>
            </li>
          )}
          {user ? (
            <>
              <li>
                <span className="text-sm">Hallo, {user.username}</span>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Registrieren</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile Hamburger: hidden by default, visible on screens ≤480px */}
      <div className="flex-none hidden max-[480px]:flex">
        <button
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle menu"
          className="text-2xl p-2 focus:outline-none"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu Drawer: show when open, only on screens ≤480px */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-base-200 shadow-md z-50 hidden max-[480px]:flex">
          <ul className="menu menu-vertical p-4 space-y-2">
            {user?.username === 'admin' && (
              <li>
                <Link to="/admin/comments" onClick={() => setOpen(false)}>
                  Kommentare
                </Link>
              </li>
            )}
            {user ? (
              <>
                <li>
                  <span className="text-sm">Hallo, {user.username}</span>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout()
                      setOpen(false)
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" onClick={() => setOpen(false)}>
                    Registrieren
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  )
}
