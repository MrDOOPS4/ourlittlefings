import { Link, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/memories", label: "Memories" },
  { to: "/valentine", label: "Valentine" },
];

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <Heart className="w-4 h-4 text-primary fill-primary" />
          T & R
        </Link>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-body transition-colors hover:text-primary ${
                pathname === link.to ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
