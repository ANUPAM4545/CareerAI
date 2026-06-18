"use client";

import { cn } from "@/lib/utils";
import { User, Terminal } from "lucide-react";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system" | "data";
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isAi = role === "assistant";

  return (
    <div className={cn("flex w-full mb-6", isAi ? "justify-start" : "justify-end")}>
      <div className={cn("flex max-w-[80%] gap-4", isAi ? "flex-row" : "flex-row-reverse")}>
        
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded flex items-center justify-center mt-1",
          isAi ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          {isAi ? <Terminal className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "px-4 py-3 rounded-lg text-sm leading-relaxed",
          isAi 
            ? "bg-card border border-border text-card-foreground rounded-tl-none" 
            : "bg-primary text-primary-foreground rounded-tr-none"
        )}>
          <div className="whitespace-pre-wrap">{content}</div>
        </div>

      </div>
    </div>
  );
}
