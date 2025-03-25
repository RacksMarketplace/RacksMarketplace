import { UserProvider } from "../context/UserContext";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    );
}
