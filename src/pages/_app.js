import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserProvider } from "../context/UserContext";
import "../styles/globals.css"; // Ensure this file exists

export default function MyApp({ Component, pageProps }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for JWT token in localStorage
        const token = localStorage.getItem("token");

        // Redirect to login if no token is found
        if (!token && router.pathname !== "/login" && router.pathname !== "/signup") {
            router.push("/login");
        }

        setLoading(false);
    }, [router.pathname]);

    if (loading) return <p>Loading...</p>; // Prevent flickering during auth check

    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    );
}
