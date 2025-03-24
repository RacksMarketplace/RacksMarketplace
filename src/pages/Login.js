import { useState, useContext } from "react";
import { useRouter } from "next/router";
import UserContext from "../context/UserContext";

const API_URL = "https://yourbackend.onrender.com/auth/login"; // Replace with actual backend URL

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { login } = useContext(UserContext);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        if (response.ok) {
            login(result.user, result.token);
            setMessage("Login successful! Redirecting...");
            setTimeout(() => router.push("/"), 2000);
        } else {
            setMessage(result.error || "Login failed.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Log In</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
