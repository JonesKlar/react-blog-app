import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-6xl font-bold text-error">404</h1>
      <p className="text-xl mt-2">Diese Seite existiert nicht.</p>
      <Link to="/" className="btn btn-outline btn-primary mt-6">
        Zurück zur Startseite
      </Link>
    </div>
  );
}
