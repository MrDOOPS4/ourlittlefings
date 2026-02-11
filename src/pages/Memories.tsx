import { useEffect, useMemo, useState } from "react";
import { Plus, X, Image as ImageIcon, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type MemoryRow = {
  id: string;
  couple_id: string;
  caption: string;
  image_path: string | null;
  created_at: string;
};

type MemoryUI = {
  id: string;
  caption: string;
  imageUrl: string | null;
  imagePath: string | null;
  createdAt: string;
};

function publicUrlForPath(path: string) {
  const { data } = supabase.storage.from("memories").getPublicUrl(path);
  return data.publicUrl;
}

const Memories = ({ coupleId }: { coupleId: string }) => {
  const [memories, setMemories] = useState<MemoryUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [newCaption, setNewCaption] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [err, setErr] = useState<string | null>(null);

  // cleanup preview object URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const canSave = useMemo(() => {
    return Boolean(newCaption.trim() || newFile);
  }, [newCaption, newFile]);

  const loadMemories = async () => {
    setErr(null);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("memories")
        .select("id,couple_id,caption,image_path,created_at")
        .eq("couple_id", coupleId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const rows = (data ?? []) as MemoryRow[];
      const mapped: MemoryUI[] = rows.map((r) => ({
        id: r.id,
        caption: r.caption ?? "",
        imagePath: r.image_path,
        imageUrl: r.image_path ? publicUrlForPath(r.image_path) : null,
        createdAt: r.created_at,
      }));

      setMemories(mapped);
    } catch (e: any) {
      setErr(e.message ?? "Failed to load memories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coupleId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setNewFile(file);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const addMemory = async () => {
    if (!canSave) return;

    setErr(null);
    setLoading(true);

    try {
      let imagePath: string | null = null;

      // 1) upload image to storage (optional)
      if (newFile) {
        const ext = newFile.name.split(".").pop() || "jpg";
        const fileName = `${crypto.randomUUID()}.${ext}`;
        imagePath = `${coupleId}/${fileName}`;

        const { error: upErr } = await supabase.storage
          .from("memories")
          .upload(imagePath, newFile, { upsert: false });

        if (upErr) throw upErr;
      }

      // 2) insert row
      const captionToSave = newCaption.trim() || "A lovely memory ♡";

      const { data, error } = await supabase
        .from("memories")
        .insert({
          couple_id: coupleId,
          caption: captionToSave,
          image_path: imagePath,
        })
        .select("id,couple_id,caption,image_path,created_at")
        .single();

      if (error) throw error;

      const row = data as MemoryRow;

      // 3) update UI immediately
      const uiRow: MemoryUI = {
        id: row.id,
        caption: row.caption,
        imagePath: row.image_path,
        imageUrl: row.image_path ? publicUrlForPath(row.image_path) : null,
        createdAt: row.created_at,
      };

      setMemories((prev) => [uiRow, ...prev]);

      // reset form
      setNewCaption("");
      setNewFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      setShowAdd(false);
    } catch (e: any) {
      setErr(e.message ?? "Failed to save memory");
    } finally {
      setLoading(false);
    }
  };

  const removeMemory = async (m: MemoryUI) => {
    setErr(null);
    setLoading(true);
    try {
      // delete db row first
      const { error } = await supabase.from("memories").delete().eq("id", m.id);
      if (error) throw error;

      // best-effort delete storage object (if exists)
      if (m.imagePath) {
        await supabase.storage.from("memories").remove([m.imagePath]);
      }

      setMemories((prev) => prev.filter((x) => x.id !== m.id));
    } catch (e: any) {
      setErr(e.message ?? "Failed to delete memory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-semibold mb-3">Our Memories</h1>
          <p className="text-muted-foreground italic">All the little moments that mean everything</p>
          {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
        </div>

        {/* Add button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-body hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Memory
          </button>
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="max-w-md mx-auto mb-10 p-6 rounded-2xl bg-card border animate-fade-in">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-body text-muted-foreground mb-1.5">Photo</label>
                <label className="flex items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-primary/30 cursor-pointer hover:border-primary/50 transition-colors overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-xs">Click to upload</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              <div>
                <label className="block text-sm font-body text-muted-foreground mb-1.5">Caption</label>
                <input
                  type="text"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="What makes this special?"
                  className="w-full px-4 py-2 rounded-lg border bg-background text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <button
                onClick={addMemory}
                disabled={loading || !canSave}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-body hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Memory ♡"}
              </button>
            </div>
          </div>
        )}

        {loading && memories.length === 0 ? (
          <div className="text-center text-muted-foreground">Loading…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {memories.map((m, i) => (
              <div
                key={m.id}
                className="group relative rounded-2xl overflow-hidden bg-card border hover-float animate-fade-in"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <button
                  onClick={() => removeMemory(m)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>

                <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                  {m.imageUrl ? (
                    <img src={m.imageUrl} alt={m.caption} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-muted-foreground text-sm">No photo</div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-sm font-body text-foreground/90">{m.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {(!loading && memories.length === 0) && (
          <div className="text-center py-20 text-muted-foreground font-body">
            <p className="text-lg italic">No memories yet...</p>
            <p className="text-sm mt-1">Add your first one above ♡</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Memories;
