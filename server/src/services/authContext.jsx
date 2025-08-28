import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Lấy user từ localStorage khi khởi tạo
    const [currentUser, setCurrentUser] = useState(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
                return null;
            }
        }
        return null;
    });

    // Luôn đồng bộ localStorage khi currentUser thay đổi
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('user');
        }
    }, [currentUser]);

    const updateCurrentUser = (user) => {
        setCurrentUser(user);
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser: updateCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};