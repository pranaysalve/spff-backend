import { useRouter } from "next/router";
import {
  Home,
  Users,
  Settings,
  BarChart3,
  FileText,
  CreditCard,
  Package,
  ShoppingCart,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Investor Profile", href: "/dashboard/investor-profile", icon: BarChart3 },
  { name: "People", href: "/dashboard/people", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: Package },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const router = useRouter();

  const handleNavigation = (href) => {
    router.push(href);
  };

  return (
    <div className="hidden border-r-[#f21ef2] bg-muted/40 md:block md:w-64 lg:w-52 fixed left-0 top-0 h-screen z-10">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4 lg:h-14 lg:px-6">
          <button 
            onClick={() => handleNavigation("/")} 
            className="flex items-center gap-2 font-semibold hover:text-primary transition-colors"
          >
            <span>{""}</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-left w-full transition-all hover:text-primary",
                    isActive 
                      ? "bg-muted text-primary" 
                      : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
