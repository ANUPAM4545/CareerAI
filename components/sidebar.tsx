"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Terminal,
  LayoutDashboard, 
  History, 
  Settings, 
  LogOut,
  BookOpen,
  Briefcase,
  Landmark,
  LineChart,
  HeartPulse,
  Users,
  Dumbbell
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Skills Sandbox", icon: Dumbbell, href: "/sandbox" },
  { label: "Tech Hub", icon: Terminal, href: "/practice/tech" },
  { label: "Government", icon: Landmark, href: "/practice/government" },
  { label: "Business", icon: LineChart, href: "/practice/business" },
  { label: "Healthcare", icon: HeartPulse, href: "/practice/healthcare" },
  { label: "Behavioral", icon: Users, href: "/practice/behavioral" },
  { label: "History & Feedback", icon: History, href: "/history" },
  { label: "Resources", icon: BookOpen, href: "/resources" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export const Sidebar = ({ isCollapsed = false }: { isCollapsed?: boolean }) => {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-card text-foreground border-r border-border">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className={`flex items-center mb-14 gap-3 ${isCollapsed ? 'justify-center' : 'pl-3'}`}>
          <div className="w-8 h-8 shrink-0 bg-foreground rounded-lg flex items-center justify-center shadow-lg shadow-foreground/20">
            <Terminal className="w-4 h-4 text-background" />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold tracking-tight truncate">
              CareerSpeak
            </h1>
          )}
        </Link>
        <div className="space-y-2">
          {routes.map((route) => {
            const isActive = pathname === route.href || (pathname.startsWith('/practice') && route.href === '/practice');
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm group flex p-3 w-full font-medium cursor-pointer hover:text-foreground hover:bg-muted/50 rounded-lg transition-all ${
                  isActive ? "bg-muted text-foreground border border-border" : "text-muted-foreground border border-transparent"
                } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                title={isCollapsed ? route.label : undefined}
              >
                <div className="flex items-center">
                  <route.icon className={`h-5 w-5 opacity-80 ${isCollapsed ? '' : 'mr-3'}`} />
                  {!isCollapsed && route.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="px-3 py-2">
        <button 
          onClick={handleLogout}
          className={`text-sm group flex p-3 w-full font-medium cursor-pointer hover:text-foreground hover:bg-muted/50 rounded-lg transition-all text-muted-foreground ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          title={isCollapsed ? "End Session" : undefined}
        >
          <div className="flex items-center">
            <LogOut className={`h-5 w-5 opacity-80 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && "End Session"}
          </div>
        </button>
      </div>
    </div>
  );
};
