// pages/RegisterPage.jsx
import { useState, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import PasswordField from '../components/PasswordField.jsx';
import TextField from './../components/TextField.jsx';
import { useDB } from './../context/DbContext.jsx';
import { toast } from 'react-toastify';

function RegisterPage() {

    const { getUserByName, addUser } = useDB();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    if (user) return <Navigate to="/" replace />;

    const refUsername = useRef();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const user = await getUserByName(username);

            if (user)
                setError('Benutzername ist bereits vergeben.'); return;

            const newUser = { username, password };
            await addUser(newUser);
            setSuccess(true);
        } catch (error) {
            toast.error('Fehler bei der Registrierung:', error);
            setError('Fehler bei der Registrierung.');
        }
        setTimeout(() => {
            debugger
            navigate('/login')
        }, 1500);
    };

    return (
        <form onSubmit={handleRegister} className="max-w-sm mx-auto space-y-4 mt-10">
            <h2 className="text-2xl font-bold text-center">Registrieren</h2>
            {error && <div className="alert alert-error p-2 text-sm">{error}</div>}
            {success && <div className="alert alert-success p-2 text-sm">Erfolgreich registriert! Weiterleitung...</div>}
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
            />
            <button type="submit" className="btn btn-primary w-full">Registrieren</button>
        </form>
    );
}

export default RegisterPage;
