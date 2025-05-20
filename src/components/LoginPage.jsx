import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";

function LoginPage() {
  const { user, authChecked } = useAuth();

  const isLocalhost = window.location.hostname === "localhost";

  const redirectTo = isLocalhost
    ? "http://localhost:3000"
    : "https://shuckz77.github.io/PWCJR/"; // Trailing slash is important for Supabase!

  if (!authChecked) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        Checking authentication...
      </div>
    );
  }

  // If logged in, redirect to home
  if (user && user.email.endsWith("@pw.live")) {
    window.location.href = "/";
    return null;
  }

  return (
    //redirectTo
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Sign in with your pw.live email</h2>
      <Auth
        supabaseClient={supabase}
        providers={["google"]}
        appearance={{ theme: ThemeSupa }}
        onlyThirdPartyProviders
        redirectTo={window.location.origin + window.location.pathname}
      />
    </div>
  );
}

export default LoginPage;
