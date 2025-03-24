import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing stored user:", error);
                localStorage.removeItem("user"); // Remove if invalid
            }
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        router.push("/");
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        router.push("/login");
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
