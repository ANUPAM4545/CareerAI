"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Mic, 
  History, 
  Settings, 
  LogOut,
  BrainCircuit
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-indigo-500",
  },
  {
    label: "Practice Interview",
    icon: Mic,
    href: "/practice",
    color: "text-emerald-500",
  },
  {
    label: "English Coach",
    icon: MessageSquare,
    href: "/practice/english_coach",
    color: "text-cyan-500",
  },
  {
    label: "History & Feedback",
    icon: History,
    href: "/history",
    color: "text-purple-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-950 text-white border-r border-white/10">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14 gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">
            CareerSpeak AI
          </h1>
        </Link>
        <div className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/5 rounded-lg transition-colors ${
                pathname === route.href ? "bg-white/10 text-white" : "text-slate-400"
              }`}
            >
              <div className="flex items-center flex-1">
                <route.icon className={`h-5 w-5 mr-3 ${route.color}`} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <button 
          onClick={handleLogout}
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/5 rounded-lg transition-colors text-slate-400"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-5 w-5 mr-3 text-rose-500" />
            Log Out
          </div>
        </button>
      </div>
    </div>
  );
};
