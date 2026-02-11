import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const sendLink = async () => {
    setErr(null);
    setSent(false);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErr("Please enter an email address.");
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        setErr(error.message);
      } else {
        setSent(true);
      }
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setSending(false);
    }
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

      <button
        onClick={sendLink}
        disabled={sending}
        style={{
          marginTop: 12,
          padding: 10,
          width: "100%",
          opacity: sending ? 0.7 : 1,
          cursor: sending ? "not-allowed" : "pointer",
        }}
      >
        {sending ? "Sending..." : "Send login link"}
      </button>

      {sent && <p style={{ marginTop: 12 }}>Check your email for the link.</p>}
      {err && <p style={{ marginTop: 12, color: "crimson" }}>{err}</p>}
    </div>
  );
}
