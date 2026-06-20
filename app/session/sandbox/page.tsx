"use client";

import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { Send, Loader2, Square, ShieldCheck, UserCircle, Bot, Mic, Activity, Dumbbell } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function SandboxSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skillId = searchParams.get("skill") || "General Practice";
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice Input State
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome, Safari, or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInput((prev) => prev + (prev ? ' ' : '') + finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    } catch (e) {
      console.error("Failed to start speech recognition", e);
    }
  };

  const speakText = async (text: string) => {
    // Clean up text
    let cleanText = text.replace(/```[\s\S]*?```/g, 'Here is a code snippet.');
    cleanText = cleanText.replace(/[*#`_]/g, '');
    
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Default to a female Indian voice for the Sandbox Tutor
        body: JSON.stringify({ text: cleanText, gender: 'female' }) 
      });
      
      if (!res.ok) throw new Error('TTS Failed');
      const data = await res.json();
      
      if (data.audioContent) {
        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
        }
        const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;
        audio.play().catch(e => console.error("Audio play failed:", e));
      }
    } catch (e) {
      console.error("TTS fetch error", e);
    }
  };

  const initialized = useRef(false);
  const supabase = createClient();

  // Auto-start the sandbox session
  useEffect(() => {
    const initSession = async () => {
      if (messages.length === 0 && !initialized.current) {
        initialized.current = true;

        // Create session in DB
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const { data: session } = await supabase
            .from("sessions")
            .insert({
              user_id: userData.user.id,
              mode: "sandbox",
              input_type: "text",
            })
            .select()
            .single();
            
          if (session) {
            setSessionId(session.id);
          }
        }
        
        sendMessage("Start practice", true);
      }
    };
    initSession();
  }, [messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleEndSession = async () => {
    // Sandbox doesn't do a heavy graded evaluation at the end, 
    // it just kicks them back to the dashboard.
    router.push("/sandbox");
  };

  const sendMessage = async (content: string, isSystem = false) => {
    const userMsg = { role: "user", content, id: Date.now().toString() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    // Save user message to DB
    if (!isSystem && sessionId) {
      await supabase.from("messages").insert({
        session_id: sessionId,
        sender: "user",
        transcript: content,
      });
    }

    try {
      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          mode: "sandbox",
          topic: skillId,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      const assistantMsgId = Date.now().toString() + "_ai";
      setMessages((prev) => [...prev, { role: "assistant", content: "", id: assistantMsgId }]);

      let fullAssistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(l => l.trim().startsWith('data: '));
        
        for (const line of lines) {
          const dataStr = line.replace('data: ', '').trim();
          if (dataStr === '[DONE]') continue;
          
          try {
            const data = JSON.parse(dataStr);
            if (data.type === 'text-delta' && data.delta) {
              fullAssistantMessage += data.delta;
              setMessages((prev) => 
                prev.map(m => m.id === assistantMsgId ? { ...m, content: m.content + data.delta } : m)
              );
            } else if (data.type === 'error') {
              setMessages((prev) => 
                prev.map(m => m.id === assistantMsgId ? { ...m, content: `Error: ${data.errorText || 'An unknown error occurred during generation.'}` } : m)
              );
            }
          } catch (e) {
            console.error("Error parsing chunk", e);
          }
        }
      }

      // Save complete assistant message to DB
      if (sessionId && fullAssistantMessage) {
        await supabase.from("messages").insert({
          session_id: sessionId,
          sender: "ai",
          transcript: fullAssistantMessage,
        });
      }

      // Speak the AI's response out loud
      speakText(fullAssistantMessage);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const displayMessages = messages.filter(m => m.content !== "Start practice");

  return (
    <div className="flex flex-col h-screen w-full relative overflow-hidden bg-black/95">
      
      {/* --- Advanced Holographic Background --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        {/* Radar grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        
        {/* Pulsing Orb - Modified to Blue/Purple for Sandbox */}
        <motion.div 
          animate={{
            scale: isLoading ? [1, 1.2, 1] : [1, 1.05, 1],
            rotate: isLoading ? 360 : 0,
            opacity: isLoading ? 0.8 : 0.3
          }}
          transition={{
            duration: isLoading ? 3 : 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-[600px] h-[600px] rounded-full border border-blue-500/20 bg-blue-500/5 blur-3xl"
        />
        <motion.div 
          animate={{
            rotate: isLoading ? -360 : 0,
          }}
          transition={{
            duration: isLoading ? 4 : 12,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-[400px] h-[400px] rounded-full border border-dashed border-purple-500/20 opacity-50"
        />
      </div>

      {/* --- Glass Header --- */}
      <header className="flex items-center justify-between px-8 py-6 bg-black/40 backdrop-blur-2xl z-20 border-b border-white/5 relative">
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="flex items-center gap-6">
          <div className="relative">
            <motion.div 
              animate={{ rotate: isLoading ? 360 : 0 }} 
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 rounded-full border border-dashed border-blue-500/40"
            />
            <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] backdrop-blur-md relative z-10">
              <Dumbbell className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h2 className="font-extrabold text-xl flex items-center gap-3 text-white tracking-wide">
              Skill Sandbox Tutor
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-blue-500/30">
                {skillId.replace('-', ' ')}
              </span>
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-[2px] h-3">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={isLoading ? { height: ["20%", "100%", "20%"] } : { height: "20%" }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                      className="w-1 bg-purple-400 rounded-full"
                    />
                  ))}
                </div>
                <span className="text-xs text-purple-400 font-mono tracking-widest uppercase">
                  {isLoading ? "Synthesizing" : "Standby"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[9px] font-mono tracking-widest uppercase">
                <ShieldCheck className="w-3 h-3" /> Unproctored
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={handleEndSession}
          className="group text-xs font-bold text-white/50 hover:text-white px-5 py-3 rounded-lg flex items-center transition-all border border-white/10 hover:bg-white/10 backdrop-blur-md uppercase tracking-wider"
        >
          <Square className="w-3 h-3 mr-2 fill-current" /> Exit Sandbox
        </button>
      </header>

      {/* --- Main Chat Area --- */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth z-10 custom-scrollbar">
        <AnimatePresence initial={false}>
          {displayMessages.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
              className="mb-4"
            >
              <MessageBubble role={m.role as any} content={m.content} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            className="flex items-center gap-4 text-blue-400 text-sm font-mono mt-8 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 w-fit backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.1)]"
          >
            <Loader2 className="w-5 h-5 animate-spin" /> 
            <span className="tracking-widest uppercase">Analyzing Answer...</span>
          </motion.div>
        )}
        <div ref={bottomRef} className="h-10" />
      </div>

      {/* --- Futuristic Input Area --- */}
      <div className="p-6 md:p-8 bg-black/40 backdrop-blur-2xl z-20 border-t border-white/5 relative">
        <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        <form 
          onSubmit={handleSubmit} 
          className="relative max-w-4xl mx-auto flex items-end gap-4"
        >
          <div className="relative flex-1 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="PRACTICE INPUT... [PRESS ENTER TO TRANSMIT]"
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-16 py-5 text-sm focus:outline-none focus:ring-0 focus:border-blue-500/50 text-white placeholder:text-white/30 transition-all resize-none shadow-inner min-h-[64px] max-h-[200px] font-mono relative z-10 backdrop-blur-md"
              disabled={isLoading}
              rows={1}
            />
            <button
              type="button"
              onClick={toggleRecording}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 transition-colors z-20 flex items-center ${isRecording ? 'text-red-500' : 'text-white/40 hover:text-blue-400'}`}
              title={isRecording ? "Stop Recording" : "Voice Input (Speech-to-Text)"}
            >
              {isRecording && (
                <div className="flex items-center gap-0.5 mr-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ["4px", "16px", "4px"] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                      className="w-[3px] bg-red-500 rounded-full"
                    />
                  ))}
                </div>
              )}
              <Mic className="w-5 h-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="p-5 bg-white/5 text-white/30 rounded-2xl border border-white/10 h-[64px] w-[64px] flex items-center justify-center shrink-0">
              <Square className="w-5 h-5 fill-current" />
            </div>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59,130,246,0.4)" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!input.trim()}
              className="p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-50 h-[64px] w-[64px] flex items-center justify-center shrink-0 border border-blue-500/50 disabled:shadow-none relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Send className="w-6 h-6 relative z-10" />
            </motion.button>
          )}
        </form>
        
        <div className="text-center mt-5 text-[9px] text-white/30 font-mono uppercase tracking-[0.2em] flex items-center justify-center gap-3">
          <Activity className="w-3 h-3 text-blue-500" />
          Unproctored Practice Session // Feel free to use external resources
        </div>
      </div>
    </div>
  );
}
