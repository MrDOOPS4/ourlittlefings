import { useState } from "react";
import { CalendarHeart, MapPin, Clock, Plus, Trash2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface DatePlan {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  vibe: string;
}

const vibes = ["Romantic 🌹", "Adventure 🌄", "Cosy Night In 🕯️", "Foodie 🍝", "Surprise ✨", "Silly 🤪"];

const DateBuilder = () => {
  const [dates, setDates] = useState<DatePlan[]>([
    {
      id: "1",
      title: "Picnic in the Park",
      date: "2026-03-01",
      time: "12:00",
      location: "Our favourite spot 🌳",
      notes: "Bring the blanket and snacks! Maybe some strawberries too.",
      vibe: "Romantic 🌹",
    },
    {
      id: "2",
      title: "Movie Marathon Night",
      date: "2026-02-14",
      time: "19:00",
      location: "Home sweet home 🏠",
      notes: "All the Studio Ghibli films, popcorn, and cuddles.",
      vibe: "Cosy Night In 🕯️",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    notes: "",
    vibe: vibes[0],
  });

  const addDate = () => {
    if (!form.title || !form.date) return;
    setDates((prev) => [
      ...prev,
      { ...form, id: Date.now().toString() },
    ]);
    setForm({ title: "", date: "", time: "", location: "", notes: "", vibe: vibes[0] });
    setOpen(false);
  };

  const removeDate = (id: string) => {
    setDates((prev) => prev.filter((d) => d.id !== id));
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
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <CalendarHeart className="w-8 h-8 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-2">
            Date Builder
          </h1>
          <p className="text-muted-foreground font-body italic">
            Plan our next adventure together ♡
          </p>
        </div>

        {/* Add Date Button */}
        <div className="flex justify-center mb-10">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full gap-2 px-6">
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
                {/* Vibe picker */}
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
                <Button onClick={addDate} className="w-full rounded-full" disabled={!form.title || !form.date}>
                  Add Date ♡
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Upcoming Dates */}
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
                          {d.vibe}
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
                      {formatDate(d.date)}{d.time && ` at ${d.time}`}
                    </p>
                    {d.location && (
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {d.location}
                      </p>
                    )}
                    {d.notes && (
                      <p className="pt-1 text-foreground/70 italic">"{d.notes}"</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Past Dates */}
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
                          {d.vibe}
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
                      {formatDate(d.date)}{d.time && ` at ${d.time}`}
                    </p>
                    {d.location && (
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        {d.location}
                      </p>
                    )}
                    {d.notes && (
                      <p className="pt-1 italic">"{d.notes}"</p>
                    )}
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
      </div>
    </div>
  );
};

export default DateBuilder;
