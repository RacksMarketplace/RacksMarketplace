import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData, token) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        setUser(userData);
        router.push("/");
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        router.push("/login");
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    return (
        <UserContext.Provider value={{ user, login, logout, getAuthHeaders }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;