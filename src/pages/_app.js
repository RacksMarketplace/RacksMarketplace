import { UserProvider } from "../context/UserContext"; // ✅ Import first
import "../styles/globals.css"; // ✅ Global styles
import { useEffect } from "react"; // ✅ Any other imports should come AFTER

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
