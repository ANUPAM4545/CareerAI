"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { PanelLeftClose, PanelLeftOpen, Sun, Moon } from "lucide-react";

export function DashboardLayoutClient({ 
  children, 
  userProfile 
}: { 
  children: React.ReactNode, 
  userProfile: { fullName: string, avatarUrl: string } 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-full relative bg-background">
      {/* Sidebar */}
      <div 
        className={`hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-80 transition-all duration-300 ${isCollapsed ? 'md:w-20' : 'md:w-72'}`}
      >
        <Sidebar isCollapsed={isCollapsed} />
      </div>

      {/* Main Content Area */}
      <main className={`transition-all duration-300 ${isCollapsed ? 'md:pl-20' : 'md:pl-72'} pb-10 min-h-screen flex flex-col`}>
        
        {/* Global Top Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-40">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          >
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const isDark = document.documentElement.classList.contains("dark");
                if (isDark) {
                  document.documentElement.classList.remove("dark");
                } else {
                  document.documentElement.classList.add("dark");
                }
              }}
              className="p-2 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors flex items-center justify-center border border-border"
              title="Toggle Theme"
            >
              <span className="hidden dark:block"><Sun className="w-4 h-4" /></span>
              <span className="block dark:hidden"><Moon className="w-4 h-4" /></span>
            </button>
            <div className="h-6 w-[1px] bg-border hidden sm:block" />
            <span className="text-sm font-medium text-foreground hidden sm:block">
              {userProfile.fullName || "Developer"}
            </span>
            {userProfile.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-border" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold uppercase shadow-sm">
                {userProfile.fullName ? userProfile.fullName.substring(0, 2) : "CS"}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
