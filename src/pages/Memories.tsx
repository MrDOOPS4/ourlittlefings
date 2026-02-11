import { useState } from "react";
import { Heart, Plus, X, Image as ImageIcon } from "lucide-react";

interface Memory {
  id: string;
  src: string;
  caption: string;
}

const placeholderMemories: Memory[] = [
  { id: "1", src: "", caption: "Our first adventure together 💕" },
  { id: "2", src: "", caption: "That perfect sunset 🌅" },
  { id: "3", src: "", caption: "Laughing until it hurt 😂" },
  { id: "4", src: "", caption: "The cozy rainy day ☔" },
];

const Memories = () => {
  const [memories, setMemories] = useState<Memory[]>(placeholderMemories);
  const [showAdd, setShowAdd] = useState(false);
  const [newCaption, setNewCaption] = useState("");
  const [newImage, setNewImage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addMemory = () => {
    if (!newCaption && !newImage) return;
    setMemories((prev) => [
      { id: Date.now().toString(), src: newImage, caption: newCaption || "A lovely memory ♡" },
      ...prev,
    ]);
    setNewCaption("");
    setNewImage("");
    setShowAdd(false);
  };

  const removeMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-semibold mb-3">Our Memories</h1>
          <p className="text-muted-foreground italic">All the little moments that mean everything</p>
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
                  {newImage ? (
                    <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
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
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-body hover:opacity-90 transition-opacity"
              >
                Save Memory ♡
              </button>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {memories.map((memory, i) => (
            <div
              key={memory.id}
              className="group relative rounded-2xl overflow-hidden bg-card border hover-float animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="aspect-[4/3] bg-accent/30 flex items-center justify-center overflow-hidden">
                {memory.src ? (
                  <img src={memory.src} alt={memory.caption} className="w-full h-full object-cover" />
                ) : (
                  <Heart className="w-10 h-10 text-primary/30 fill-primary/10" />
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-body text-foreground">{memory.caption}</p>
              </div>
              <button
                onClick={() => removeMemory(memory.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {memories.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Heart className="w-12 h-12 mx-auto mb-4 text-primary/20" />
            <p className="font-body italic">No memories yet... let's make some! ♡</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Memories;
