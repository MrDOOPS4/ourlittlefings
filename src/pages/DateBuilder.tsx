import { useEffect, useMemo, useState } from "react";
import { CalendarHeart, Plus, Trash2, Sparkles, MapPin, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DateRow = {
  id: string;
  couple_id: string;
  title: string;
  date: string; // yyyy-mm-dd
  time: string | null;
  location: string | null;
  notes: string | null;
  vibe: string | null;
  created_at: string;
};

const vibes = [
  "Romantic 🌹",
  "Cosy Night In 🕯️",
  "Adventure 🚗",
  "Foodie 🍜",
  "Outdoors 🌳",
  "Chill ☁️",
];

const DateBuilder = ({ coupleId }: { coupleId: string }) => {
  const [dates, setDates] = useState<DateRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    notes: "",
    vibe: vibes[0],
  });

  const canAdd = useMemo(() => form.title.trim() && form.date, [form.title, form.date]);

  const loadDates = async () => {
    setErr(null);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("dates")
        .select("id,couple_id,title,date,time,location,notes,vibe,created_at")
        .eq("couple_id", coupleId)
        .order("date", { ascending: true });

      if (error) throw error;
      setDates((data ?? []) as DateRow[]);
    } catch (e: any) {
      setErr(e.message ?? "Failed to load dates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coupleId]);

  const addDate = async () => {
    if (!canAdd) return;

    setErr(null);
    setLoading(true);
    try {
      const payload = {
        couple_id: coupleId,
        title: form.title.trim(),
        date: form.date,
        time: form.time || null,
        location: form.location.trim() || null,
        notes: form.notes.trim() || null,
        vibe: form.vibe || null,
      };

      const { data, error } = await supabase
        .from("dates")
        .insert(payload)
        .select("id,couple_id,title,date,time,location,notes,vibe,created_at")
        .single();

      if (error) throw error;

      setDates((prev) => {
        const next = [...prev, data as DateRow];
        next.sort((a, b) => a.date.localeCompare(b.date));
        return next;
      });

      setForm({ title: "", date: "", time: "", location: "", notes: "", vibe: vibes[0] });
      setOpen(false);
    } catch (e: any) {
      setErr(e.message ?? "Failed to add date");
    } finally {
      setLoading(false);
    }
  };

  const removeDate = async (id: string) => {
    setErr(null);
    setLoading(true);
    try {
      const { error } = await supabase.from("dates").delete().eq("id", id);
      if (error) throw error;
      setDates((prev) => prev.filter((d) => d.id !== id));
    } catch (e: any) {
      setErr(e.message ?? "Failed to delete date");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  };

  const isPast = (dateStr: string) => new Date(dateStr + "T23:59:59") < new Date();
  const upcoming = dates.filter((d) => !isPast(d.date)).sort((a, b) => a.date.localeCompare(b.date));
  const past = dates.filter((d) => isPast(d.date)).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10 animate-fade-in">
          <CalendarHeart className="w-8 h-8 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-2">
            Date Builder
          </h1>
          <p className="text-muted-foreground font-body italic">
            Plan our next adventure together ♡
          </p>
          {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
        </div>

        <div className="flex justify-center mb-10">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full gap-2 px-6" disabled={loading}>
                <Plus className="w-4 h-4" />
                Plan a New Date
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Plan a Date ♡</DialogTitle>
                <DialogDescription className="text-muted-foreground font-body">
                  Fill in the details for our next date!
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <Input
                  placeholder="Date title (e.g. Sunset Walk)"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                  <Input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </div>
                <Input
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
                <Textarea
                  placeholder="Notes, ideas, things to bring..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                />

                <div>
                  <p className="text-sm font-body text-muted-foreground mb-2">Pick a vibe:</p>
                  <div className="flex flex-wrap gap-2">
                    {vibes.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setForm({ ...form, vibe: v })}
                        className={`text-xs font-body px-3 py-1.5 rounded-full border transition-colors ${
                          form.vibe === v
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={addDate} className="w-full rounded-full" disabled={!canAdd || loading}>
                  {loading ? "Saving..." : "Add Date ♡"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading && dates.length === 0 ? (
          <div className="text-center text-muted-foreground">Loading…</div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Upcoming
                </h2>
                <div className="space-y-4">
                  {upcoming.map((d) => (
                    <Card key={d.id} className="hover-float group">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-body px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground mb-2 inline-block">
                              {d.vibe ?? ""}
                            </span>
                            <CardTitle className="text-lg font-display">{d.title}</CardTitle>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                            onClick={() => removeDate(d.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-1.5 text-sm font-body text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <CalendarHeart className="w-3.5 h-3.5 text-primary" />
                          {formatDate(d.date)}{d.time ? ` at ${d.time}` : ""}
                        </p>
                        {d.location && (
                          <p className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            {d.location}
                          </p>
                        )}
                        {d.notes && <p className="pt-1 text-foreground/70 italic">"{d.notes}"</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className="text-xl font-display font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Past Dates
                </h2>
                <div className="space-y-4 opacity-70">
                  {past.map((d) => (
                    <Card key={d.id} className="group">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-body px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground mb-2 inline-block">
                              {d.vibe ?? ""}
                            </span>
                            <CardTitle className="text-lg font-display">{d.title}</CardTitle>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                            onClick={() => removeDate(d.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-1.5 text-sm font-body text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <CalendarHeart className="w-3.5 h-3.5" />
                          {formatDate(d.date)}{d.time ? ` at ${d.time}` : ""}
                        </p>
                        {d.location && (
                          <p className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" />
                            {d.location}
                          </p>
                        )}
                        {d.notes && <p className="pt-1 italic">"{d.notes}"</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {dates.length === 0 && (
              <div className="text-center py-20 text-muted-foreground font-body">
                <p className="text-lg italic">No dates planned yet...</p>
                <p className="text-sm mt-1">Tap the button above to plan your first one! ♡</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DateBuilder;
