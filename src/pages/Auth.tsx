import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const sendLink = async () => {
    await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>Sign in</h1>
      <p>Enter your email and we’ll send a magic login link.</p>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        style={{ width: "100%", padding: 10, marginTop: 8 }}
      />
      <button onClick={sendLink} style={{ marginTop: 12, padding: 10, width: "100%" }}>
        Send login link
      </button>
      {sent && <p style={{ marginTop: 12 }}>Check your email for the link.</p>}
      {err && <p style={{ marginTop: 12, color: "crimson" }}>{err}</p>}
    </div>
  );
}
