import { useState, useRef } from "react";
import { Heart } from "lucide-react";

const Valentine = () => {
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const [noCount, setNoCount] = useState(0);

  const noMessages = [
    "No 😢",
    "Are you sure?",
    "Really sure?",
    "Think again!",
    "Pleeeease? 🥺",
    "I'll be sad 😭",
    "Pretty please?",
    "With a cherry on top?",
    "You're breaking my heart 💔",
    "FINAL ANSWER?!",
  ];

  const handleNo = () => {
    setNoCount((prev) => Math.min(prev + 1, noMessages.length - 1));
    // Make the no button move away randomly
    if (noBtnRef.current) {
      const x = Math.random() * 200 - 100;
      const y = Math.random() * 200 - 100;
      noBtnRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  };

  if (answer === "yes") {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                className="w-8 h-8 text-primary fill-primary animate-float"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-semibold mb-4">Yaaay! 🥰</h1>
          <p className="text-xl text-muted-foreground font-body italic">
            I knew you'd say yes! Happy Valentine's Day, Tallulah! ♡
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-lg animate-fade-in">
        <Heart className="w-16 h-16 text-primary fill-primary mx-auto mb-8 animate-heartbeat" />
        <h1 className="text-4xl md:text-5xl font-display font-semibold mb-3">
          Will you be my Valentine?
        </h1>
        <p className="text-muted-foreground font-body italic mb-10">
          Tallulah, you already know the right answer... 😏
        </p>
        <div className="flex items-center justify-center gap-4 relative">
          <button
            onClick={() => setAnswer("yes")}
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-body text-lg hover:opacity-90 transition-all hover:scale-105"
            style={{ fontSize: `${1.1 + noCount * 0.15}rem` }}
          >
            Yes! 💕
          </button>
          <button
            ref={noBtnRef}
            onClick={handleNo}
            className="px-8 py-3 rounded-full border border-border text-muted-foreground font-body hover:bg-muted transition-all"
            style={{
              fontSize: `${Math.max(0.7, 1 - noCount * 0.05)}rem`,
              transition: "all 0.3s ease",
            }}
          >
            {noMessages[noCount]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Valentine;
