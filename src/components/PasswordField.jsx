// components/PasswordField.jsx
import { useState } from 'react';

function PasswordField({ label, value, onChange, placeholder = 'Passwort', error }) {
  const [show, setShow] = useState(false);

  return (
    <div className="form-control">
      {label && <label className="label"><span className="label-text">{label}</span></label>}
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          className={`input input-bordered w-full pr-10 ${error ? 'input-error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
        >
          {show ? '🙈' : '👁️'}
        </button>
      </div>
      {error && <label className="label text-error text-sm">{error}</label>}
    </div>
  );
}

export default PasswordField;
