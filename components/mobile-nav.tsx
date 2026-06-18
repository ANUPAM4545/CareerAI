import Link from "next/link";
import { LayoutDashboard, Mic, BookOpen, History } from "lucide-react";

export function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border flex justify-around items-center h-16 pb-safe">
      <Link href="/dashboard" className="flex flex-col items-center justify-center w-full h-full text-primary gap-1">
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      <Link href="/dashboard/interview" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground transition-colors gap-1">
        <Mic className="w-5 h-5" />
        <span className="text-[10px] font-medium">Interview</span>
      </Link>
      <Link href="/dashboard/english" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground transition-colors gap-1">
        <BookOpen className="w-5 h-5" />
        <span className="text-[10px] font-medium">English</span>
      </Link>
      <Link href="/dashboard/history" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground transition-colors gap-1">
        <History className="w-5 h-5" />
        <span className="text-[10px] font-medium">History</span>
      </Link>
    </div>
  )
}
