import { useAuth } from "../context/AuthContext";
import LoginPage from "./LoginPage";

function AuthGate({ children }) {
  const { user, authChecked } = useAuth();

  // console.warn({ user, authChecked })

  if (!authChecked) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        Checking authentication...
      </div>
    );
  }

  // Not logged in? Show login page (no Navbar, no layout)
  if (!user) {
    return <LoginPage />;
  }

  // Logged in: show the protected app (children)
  return children;
}

export default AuthGate;
