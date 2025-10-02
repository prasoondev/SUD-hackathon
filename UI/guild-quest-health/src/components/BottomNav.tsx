import { Home, Dumbbell, Trophy, Award, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Dumbbell, label: "Training", path: "/training" },
  { icon: Trophy, label: "Leagues", path: "/leagues" },
  { icon: Award, label: "Trophies", path: "/trophies" },
];

export function BottomNav() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-xl transition-all duration-300",
                isActive
                  ? "text-primary scale-110"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6 mb-1 transition-transform duration-300",
                  isActive && "animate-bounce-soft"
                )}
              />
              <span className={cn(
                "text-xs font-medium transition-all duration-300",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          className="flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <LogOut className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Logout</span>
        </Button>
      </div>
    </nav>
  );
}
