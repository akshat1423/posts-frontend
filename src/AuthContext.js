import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('userName');
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const login = (userName) => {
        localStorage.setItem('userName', userName);
        setCurrentUser(userName);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
