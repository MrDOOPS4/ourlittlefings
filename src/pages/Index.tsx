import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import heroFloral from "@/assets/hero-floral.jpg";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroFloral})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />

        <div className="relative z-10 text-center px-4 py-20 animate-fade-in">
          <Heart className="w-8 h-8 text-primary fill-primary mx-auto mb-6 animate-heartbeat" />
          <h1 className="text-5xl md:text-7xl font-display font-semibold tracking-tight text-foreground mb-4">
            Tallulah <span className="text-gradient-rose">&</span> Ryan
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-body italic max-w-md mx-auto mb-10">
            Our site for all our little fings ♡
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/memories"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-body text-sm hover:opacity-90 transition-opacity"
            >
              Our Memories
            </Link>
            <Link
              to="/valentine"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary text-primary font-body text-sm hover:bg-primary/10 transition-colors"
            >
              Valentine's ♡
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-muted-foreground font-body">
        made with love ♡
      </footer>
    </div>
  );
};

export default Index;
