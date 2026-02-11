import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function makeCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function CoupleSetup({ onReady }: { onReady: (coupleId: string) => void }) {
  const [code, setCode] = useState("");
  const [myCode, setMyCode] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already saved on device, use it
  useEffect(() => {
    const saved = localStorage.getItem("olf.couple_id");
    if (saved) onReady(saved);
  }, [onReady]);

  const createCouple = async () => {
    setErr(null);
    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not logged in");

      const newCode = makeCode();
      const { data: couple, error } = await supabase
        .from("couples")
        .insert({ code: newCode })
        .select()
        .single();
      if (error) throw error;

      const { error: mErr } = await supabase
        .from("couple_members")
        .insert({ couple_id: couple.id, user_id: user.id });
        if (mErr) throw mErr;

      setMyCode(couple.code);
      localStorage.setItem("olf.couple_id", couple.id);
      onReady(couple.id);
    } catch (e: any) {
      setErr(e.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  };

  const joinCouple = async () => {
    setErr(null);
    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not logged in");

      const { data: couple, error } = await supabase
        .from("couples")
        .select("*")
        .eq("code", code.toUpperCase())
        .single();
      if (error) throw error;

      const { error: mErr } = await supabase
        .from("couple_members")
        .insert({ couple_id: couple.id, user_id: user.id });
      if (mErr) throw mErr;

      localStorage.setItem("olf.couple_id", couple.id);
      onReady(couple.id);
    } catch (e: any) {
      setErr(e.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h1>Link your phones</h1>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button onClick={createCouple} disabled={loading} style={{ padding: 10, flex: 1 }}>
          Create couple code
        </button>
      </div>

      {myCode && (
        <p style={{ marginTop: 12 }}>
          Your code: <b style={{ fontSize: 18 }}>{myCode}</b> (send this to your partner)
        </p>
      )}

      <hr style={{ margin: "24px 0" }} />

      <h3>Join with a code</h3>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter code e.g. A1B2C3"
        style={{ width: "100%", padding: 10, marginTop: 8 }}
      />
      <button onClick={joinCouple} disabled={loading || !code} style={{ marginTop: 12, padding: 10, width: "100%" }}>
        Join
      </button>

      {err && <p style={{ marginTop: 12, color: "crimson" }}>{err}</p>}
    </div>
  );
}
