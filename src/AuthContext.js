import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [lichessUsername, setLichessUsername] = useState('');
    const [chesscomUsername, setChesscomUsername] = useState('');

    const checkTokenCookie = () => {
        return document.cookie.split('; ').some((item) => item.trim().startsWith('token='));
    };

    const getToken = () => {
        const tokenString = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (tokenString) {
            return tokenString.split('=')[1];
        }
        return null;
    };

    const getLichessUsername = () => { 
        return document.cookie.split('; ').find(row => row.startsWith('lichessUsername='))?.split('=')[1] || '';
    };

    const getChesscomUsername = () => {
        return document.cookie.split('; ').find(row => row.startsWith('chesscomUsername='))?.split('=')[1] || '';
    };


    const login = (token, lichessUser, chesscomUser) => {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + 3 * 60 * 60 * 1000); // 3 hours from now
        
        document.cookie = `token=${token}; path=/; expires=${expirationDate.toUTCString()}`;
        document.cookie = `lichessUsername=${lichessUser || ''}; path=/; expires=${expirationDate.toUTCString()}`;
        document.cookie = `chesscomUsername=${chesscomUser || ''}; path=/; expires=${expirationDate.toUTCString()}`;
        
        setIsLoggedIn(true);
        setLichessUsername(lichessUser || '');
        setChesscomUsername(chesscomUser || '');
    };

    const logout = () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'lichessUsername=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'chesscomUsername=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setIsLoggedIn(false);
        setLichessUsername('');
        setChesscomUsername('');
    };

    useEffect(() => {
        if (checkTokenCookie()) {
            setIsLoggedIn(true);
            const lichessUser = document.cookie.split('; ').find(row => row.startsWith('lichessUsername='))?.split('=')[1] || '';
            const chesscomUser = document.cookie.split('; ').find(row => row.startsWith('chesscomUsername='))?.split('=')[1] || '';
            setLichessUsername(lichessUser);
            setChesscomUsername(chesscomUser);
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            isLoggedIn, lichessUsername, setLichessUsername,
            chesscomUsername, setChesscomUsername, login, logout, getToken,
            getLichessUsername, getChesscomUsername
        }}>
            {children}
        </AuthContext.Provider>
    );
};