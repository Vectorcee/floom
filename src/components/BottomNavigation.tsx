import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  ShoppingBag, 
  Wallet as WalletIcon, 
  User 
} from "lucide-react";

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      icon: Home, 
      label: "Spaces", 
      path: "/",
      isActive: location.pathname === "/" || location.pathname === "/dashboard"
    },
    { 
      icon: ShoppingBag, 
      label: "Store", 
      path: "/store",
      isActive: location.pathname === "/store"
    },
    { 
      icon: WalletIcon, 
      label: "Wallet", 
      path: "/wallet",
      isActive: location.pathname === "/wallet"
    },
    { 
      icon: User, 
      label: "Profile", 
      path: "/profile",
      isActive: location.pathname.startsWith("/profile")
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-2 py-2 transition-colors",
              item.isActive 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon size={20} />
            <span className="text-xs font-body">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}