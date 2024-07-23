import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [lichessUsername, setLichessUsername] = useState('');
    const [chesscomUsername, setChesscomUsername] = useState('');

    const checkTokenCookie = () => {
        return document.cookie.split(';').some((item) => item.trim().startsWith('token='));
    };

    const login = (token) => {
        document.cookie = `token=${token}; path=/`;
        setIsLoggedIn(true);
    };

    const logout = () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setIsLoggedIn(false);
    };

    useEffect(() => {
        if (checkTokenCookie()) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            isLoggedIn, lichessUsername, setLichessUsername,
            chesscomUsername, setChesscomUsername, login, logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};