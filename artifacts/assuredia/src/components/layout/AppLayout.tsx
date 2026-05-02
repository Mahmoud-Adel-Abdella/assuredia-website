import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, FileBarChart, Settings, Bell, Search, Menu, Sun, Moon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoUrl from "@assets/e2a4684a-979c-4de9-be72-c3624b6dcb8c_1777651437482.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppTheme } from "@/context/ThemeContext";
import { useListAlerts } from "@workspace/api-client-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/alerts", label: "Alerts", icon: AlertCircle },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const { data: alerts } = useListAlerts({ limit: 50 });
  const openAlerts = alerts?.filter((a) => !a.resolved).length ?? 0;

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border hidden md:flex flex-col h-screen fixed top-0 left-0">
      <div className="p-6 h-16 flex items-center border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3">
          <img src={logoUrl} alt="Assuredia" className="h-8 w-auto object-contain brightness-0 invert" />
          <span className="font-bold text-lg tracking-tight">Assuredia</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-4 mt-2 px-3">
          Monitoring
        </div>
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          const showBadge = item.href === "/alerts" && openAlerts > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {openAlerts}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-accent/30">
          <Avatar className="h-9 w-9 border border-sidebar-border">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground leading-none">Admin User</span>
            <span className="text-xs text-sidebar-foreground/50 mt-1">admin@assuredia.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Header() {
  const { theme, toggleTheme } = useAppTheme();

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4 md:hidden">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <img src={logoUrl} alt="Assuredia" className="h-6 w-auto" />
        </Link>
      </div>

      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search runs, clients, alerts..."
            className="w-full bg-muted/50 border-none pl-9 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm" className="hidden lg:flex border-dashed text-xs">
          Environment: Production
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Link href="/alerts">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full border-2 border-card"></span>
          </Button>
        </Link>
      </div>
    </header>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-64">
        <Header />
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
