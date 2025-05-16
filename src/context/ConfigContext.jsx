// src/context/ConfigContext.jsx
import React, { createContext, useContext } from 'react';

const ConfigContext = createContext({
    webUrl: import.meta.env.VITE_API_URL_WEB,
    dbUrl: import.meta.env.VITE_API_URL_DB,
});

export function ConfigProvider({ children }) {
    return (
        <ConfigContext.Provider value={{
            webUrl: import.meta.env.VITE_API_URL_WEB,
            dbUrl: import.meta.env.VITE_API_URL_DB,
        }}>
            {children}
        </ConfigContext.Provider>
    );
}

export const useConfig = () => useContext(ConfigContext);
