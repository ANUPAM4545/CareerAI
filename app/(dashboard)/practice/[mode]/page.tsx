"use client";

import { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { Send, Loader2, Square } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PracticeSession({ params }: { params: { mode: string } }) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, append } = useChat({
    api: "/api/chat",
    body: {
      mode: params.mode,
      targetRole: "Software Engineer", // TODO: pull from user profile
    },
  });

  // Auto-start the interview with a system trigger if empty
  useEffect(() => {
    if (messages.length === 0) {
      append({
        role: "user",
        content: "Start interview",
      });
    }
  }, [messages.length, append]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleEndSession = async () => {
    // In the future, we will analyze the session here.
    // For now, just route back to dashboard
    router.push("/dashboard");
  };

  const isInterview = params.mode === "interview";

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full border-x border-border bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div>
          <h2 className="font-bold text-lg">
            {isInterview ? "Mock Technical Interview" : "Professional English Coach"}
          </h2>
          <p className="text-xs text-muted-foreground font-mono">
            Status: {isLoading ? "Generating response..." : "Awaiting input"}
          </p>
        </div>
        <button 
          onClick={handleEndSession}
          className="text-xs font-bold bg-destructive text-destructive-foreground px-4 py-2 rounded flex items-center hover:bg-destructive/90 transition-colors"
        >
          <Square className="w-3 h-3 mr-2 fill-current" /> End Session
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        {messages.filter(m => m.content !== "Start interview").map((m) => (
          <MessageBubble key={m.id} role={m.role as any} content={m.content} />
        ))}
        {isLoading && (
          <div className="flex items-center text-muted-foreground text-sm font-mono mt-4">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing and typing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading) handleSubmit(e);
          }} 
          className="relative max-w-3xl mx-auto flex items-center"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your response here..."
            className="w-full bg-background border border-border rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            disabled={isLoading}
          />
          {isLoading ? (
            <button 
              type="button"
              onClick={stop}
              className="absolute right-2 p-2 bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </form>
        <p className="text-center text-[10px] text-muted-foreground mt-3 font-mono">
          AI may produce inaccurate information. Please review carefully.
        </p>
      </div>
    </div>
  );
}
