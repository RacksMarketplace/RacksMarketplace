import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserProvider } from "../context/UserContext";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token && !["/login", "/signup"].includes(router.pathname)) {
            router.push("/login");
        } else {
            setLoading(false);
        }
    }, [router.pathname]);

    if (loading) return <p>Loading...</p>;

    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    );
}
