// pages/LoginPage.jsx
import { useState, useEffect,useRef } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import PasswordField from '../components/PasswordField.jsx';
import TextField from './../components/TextField.jsx';
 

function LoginPage() {
 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const refUsername = useRef();

    if (user) return <Navigate to="/" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) navigate('/');
        else setError('Login fehlgeschlagen. Benutzername oder Passwort ist falsch.');
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4 mt-10">
            <h2 className="text-2xl font-bold text-center">Login</h2>
            {error && <div className="alert alert-error p-2 text-sm">{error}</div>}
            <TextField ref={refUsername}
                label="Benutzername"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Benutzername"
            />
            <PasswordField
                label="Passwort"
                value={password}
                onChange={e => setPassword(e.target.value)}
                error={''}
            />
            <button type="submit" className="btn btn-primary w-full">Einloggen</button>
        </form>
    );
}

export default LoginPage;
