import { Link, Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

function Header() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-base-100 shadow-md mb-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost md:text-xl">Mein Blog</Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {/* <li><Link to="/">Startseite</Link></li> */}
          {user?.username === 'admin' && (
            <li><Link to="/admin/comments">Kommentare</Link></li>
          )}
          {user ? (
            <>
              <li><span className="text-sm">Hallo, {user.username}</span></li>
              <li><button onClick={logout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Registrieren</Link></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Header;


 