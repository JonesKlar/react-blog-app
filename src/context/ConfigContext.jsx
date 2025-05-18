// src/context/ConfigContext.jsx
import React, { createContext, useContext } from 'react';

const data = {
    dbUrl: import.meta.env.PROD ? import.meta.env.VITE_API_URL_DB : 'http://localhost:5000',
    isProd: import.meta.env.PROD,
}
const ConfigContext = createContext(data);

export function ConfigProvider({ children }) {
    return (
        <ConfigContext.Provider value={data}>
            {children}
        </ConfigContext.Provider>
    );
}

export const useConfig = () => useContext(ConfigContext);
