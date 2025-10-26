import { Bell, Search, User } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-400 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">{""}</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="ghost" className="h-9 w-9 px-0">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" className="h-9 w-9 px-0">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" className="h-9 w-9 px-0">
              <User className="h-4 w-4" />
              <span className="sr-only">User</span>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
