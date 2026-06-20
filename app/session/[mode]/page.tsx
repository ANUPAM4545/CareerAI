"use client";

import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { Send, Loader2, Square, ShieldCheck, UserCircle, Bot, Mic, Activity, AlertTriangle, EyeOff, Lock, Terminal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { tracks } from "@/lib/data/tracks";
import Editor from "@monaco-editor/react";

export default function PracticeSession({ params }: { params: { mode: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackId = searchParams.get("track");
  const roundId = searchParams.get("round");
  const personaId = searchParams.get("persona");
  const topic = searchParams.get("topic") || (trackId ? `${trackId} - ${roundId}` : "General");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ targetRole: string, experienceLevel: string }>({ targetRole: "Software Engineer", experienceLevel: "Mid-Level" });
  const [scenarioSeed] = useState(Math.random().toString(36).substring(7));
  
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
    // Clean up text (remove code blocks and basic markdown)
    let cleanText = text.replace(/```[\s\S]*?```/g, 'Here is a code snippet.');
    cleanText = cleanText.replace(/[*#`_]/g, '');
    
    // Determine gender
    const interviewerName = trackData?.interviewer?.name?.toLowerCase() || '';
    const isMale = ['ravi', 'marcus', 'alex', 'david', 'michael', 'rao', 'raj', 'arjun', 'sharma', 'vikram'].some(n => interviewerName.includes(n));
    const gender = isMale ? 'male' : 'female';

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, gender })
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
  
  // Code Editor State
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  
  // Track specific data
  const trackData = trackId && tracks[trackId as keyof typeof tracks];
  const roundData = trackData?.rounds?.find(r => r.id === roundId);
  const questionCount = roundData?.questions || 3;
  
  const [hasStarted, setHasStarted] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [showWarningOverlay, setShowWarningOverlay] = useState(false);
  const maxWarnings = 3;
  
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [finalEvaluation, setFinalEvaluation] = useState<any | null>(null);

  const initialized = useRef(false);
  const supabase = createClient();

  // Proctoring Anti-Cheat Event Listener
  useEffect(() => {
    if (!hasStarted) return;

    const triggerWarning = () => {
      setWarnings(prev => {
        const newWarnings = prev + 1;
        if (newWarnings >= maxWarnings) {
          setShowWarningOverlay(false);
          handleEndSession(true);
        } else {
          setShowWarningOverlay(true);
        }
        return newWarnings;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) triggerWarning();
    };

    const handleBlur = () => triggerWarning();
    
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse actually leaves the top/bottom/sides of the browser
      if (e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
        triggerWarning();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasStarted, sessionId]);

  // Auto-start the interview with a system trigger if empty AND hasStarted
  useEffect(() => {
    const initSession = async () => {
      if (hasStarted && messages.length === 0 && !initialized.current) {
        initialized.current = true;
        
        let fetchedRole = "Software Engineer";
        let fetchedExp = "Mid-Level";

        // Create session in DB and fetch profile
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const { data: profile } = await supabase.from("users").select("target_role, experience_level").eq("id", userData.user.id).single();
          if (profile) {
            fetchedRole = profile.target_role || "Software Engineer";
            fetchedExp = profile.experience_level || "Mid-Level";
            setUserProfile({ targetRole: fetchedRole, experienceLevel: fetchedExp });
          }

          const { data: session } = await supabase
            .from("sessions")
            .insert({
              user_id: userData.user.id,
              mode: params.mode,
              input_type: "text",
              track_id: trackId,
              round_id: roundId
            })
            .select()
            .single();
            
          if (session) {
            setSessionId(session.id);
          }
        }
        
        sendMessage("Start interview", true, fetchedRole, fetchedExp);
      }
    };
    initSession();
  }, [messages.length, params.mode, hasStarted]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleEndSession = async (cheatDetected = false) => {
    setIsEvaluating(true);
    
    // Attempt to exit fullscreen
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.log("Exit fullscreen failed", e);
    }
    
    if (sessionId && (cheatDetected || messages.length > 2)) {
      try {
        const res = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, cheatDetected }),
        });
        const data = await res.json();
        if (data.evaluation) {
          setFinalEvaluation(data.evaluation);
        } else {
          router.push("/history");
        }
      } catch (error) {
        console.error("Evaluation failed", error);
        router.push("/history");
      }
    } else {
      router.push("/history");
    }
    setIsEvaluating(false);
  };

  const startInterview = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.log("Fullscreen request failed", e);
    }
    setHasStarted(true);
  };

  const sendMessage = async (content: string, isSystem = false, overrideRole?: string, overrideExp?: string) => {
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
          mode: params.mode,
          targetRole: overrideRole || userProfile.targetRole,
          experienceLevel: overrideExp || userProfile.experienceLevel,
          topic: topic,
          personaId: personaId,
          roundContext: roundId,
          questionCount: questionCount,
          scenarioSeed: scenarioSeed
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
    if (!input.trim() && !code.trim()) return;
    if (isLoading) return;
    
    let submission = input.trim();
    if (roundData?.type === "coding" && code.trim()) {
      submission = `Here is my code in ${language}:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n${input.trim()}`;
    }

    sendMessage(submission);
    setInput("");
  };

  const isInterview = params.mode === "interview";
  const displayMessages = messages.filter(m => m.content !== "Start interview");

  if (isEvaluating) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-black text-white">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
        <h2 className="mt-8 text-2xl font-black tracking-widest uppercase animate-pulse">Analyzing Session Data...</h2>
        <p className="text-white/50 font-mono mt-2">Running evaluation model</p>
      </div>
    );
  }

  if (finalEvaluation) {
    const isZero = finalEvaluation.technicalScore === 0;
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-black text-white p-8">
        <div className="max-w-2xl w-full text-center space-y-8 bg-card border border-border p-12 rounded-3xl relative overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.15)]">
          {isZero && <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />}
          
          <h1 className="text-4xl font-black uppercase tracking-tight">Session Terminated</h1>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-black/50 p-6 rounded-2xl border border-white/5">
              <div className="text-sm text-white/50 uppercase tracking-widest mb-2">Technical Score</div>
              <div className={`text-6xl font-black ${isZero ? 'text-red-500' : 'text-primary'}`}>{finalEvaluation.technicalScore}</div>
            </div>
            <div className="bg-black/50 p-6 rounded-2xl border border-white/5">
              <div className="text-sm text-white/50 uppercase tracking-widest mb-2">Confidence Score</div>
              <div className={`text-6xl font-black ${isZero ? 'text-red-500' : 'text-emerald-400'}`}>{finalEvaluation.confidenceScore}</div>
            </div>
          </div>
          
          <div className="bg-black/50 p-6 rounded-2xl border border-white/5 text-left">
            <p className={`text-lg leading-relaxed ${isZero ? 'text-red-400 font-bold' : 'text-white/80'}`}>{finalEvaluation.overallFeedback}</p>
          </div>
          
          <button 
            onClick={() => router.push("/history")}
            className={`w-full py-4 font-black rounded-xl uppercase tracking-widest transition-all ${isZero ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-primary text-white hover:opacity-90 shadow-[0_0_20px_rgba(59,130,246,0.4)]'}`}
          >
            Acknowledge & Return
          </button>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full relative overflow-hidden bg-card rounded-t-3xl border border-border p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary-rgb),0.1)_0%,transparent_50%)] pointer-events-none" />
        
        <div className="max-w-xl text-center space-y-8 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Proctored Session Protocol</h1>
            <p className="text-muted-foreground font-mono">
              Track: {trackData?.title || trackId || "General"} | {roundData?.title || roundId || "General"}
            </p>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl text-left space-y-2">
            <h3 className="font-bold text-primary uppercase text-sm tracking-widest mb-1">Session Directives</h3>
            <p className="text-foreground">{roundData?.desc || "No specific description provided."}</p>
            <p className="text-primary font-mono mt-2 text-sm">
              &gt; This round consists of exactly {questionCount} questions.
            </p>
          </div>

          <div className="bg-muted border border-border p-6 rounded-2xl text-left space-y-4">
            <h3 className="font-bold text-red-500 uppercase flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Strict Anti-Cheat Enforced
            </h3>
            <ul className="space-y-3 font-mono text-sm text-foreground">
              <li className="flex items-start gap-3">
                <EyeOff className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span><strong>No Tab Switching:</strong> If you navigate away from this tab, you will receive a warning.</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span><strong>3 Strikes Rule:</strong> You are allowed exactly 3 warnings. On the 3rd strike, the session will instantly terminate and grade you a zero.</span>
              </li>
              <li className="flex items-start gap-3">
                <Square className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span><strong>Fullscreen Mode:</strong> Upon starting, your browser will enter fullscreen mode to block out distractions.</span>
              </li>
            </ul>
          </div>

          <button 
            onClick={startInterview}
            className="w-full py-4 bg-primary text-primary-foreground font-black text-lg rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] uppercase tracking-widest"
          >
            I Understand. Commence Session.
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto w-full relative overflow-hidden bg-black/95 rounded-t-3xl border-t border-x border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.15)]">
      
      {showWarningOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/95 backdrop-blur-xl">
          <div className="text-center space-y-6 max-w-lg p-10 bg-black rounded-3xl border border-red-500 shadow-[0_0_100px_rgba(239,68,68,0.3)] relative overflow-hidden">
            <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
            
            <AlertTriangle className="w-24 h-24 text-red-500 mx-auto animate-bounce" />
            <div>
              <h1 className="text-4xl font-black text-white uppercase tracking-widest">Protocol Violation</h1>
              <p className="text-red-400 font-mono mt-2 uppercase tracking-wide">Focus Lost / Tab Switched</p>
            </div>
            
            <p className="text-white/80 leading-relaxed">
              You navigated away from the proctored interview environment. This is a strict evaluation and external resources are not permitted.
            </p>
            
            <div className="bg-red-950/50 border border-red-500/30 p-4 rounded-xl">
              <p className="text-2xl font-black text-white">Warning {warnings} of {maxWarnings}</p>
              <p className="text-xs text-red-400 font-mono mt-1 uppercase">Session terminates at {maxWarnings} warnings.</p>
            </div>
            
            <button 
              onClick={() => {
                setShowWarningOverlay(false);
                if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                }
              }}
              className="px-6 py-4 mt-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl w-full transition-all tracking-widest uppercase shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            >
              Acknowledge & Return
            </button>
          </div>
        </div>
      )}
      
      {/* --- Advanced Holographic Background --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        {/* Radar grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        
        {/* Pulsing Orb */}
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
          className="absolute w-[600px] h-[600px] rounded-full border border-primary/20 bg-primary/5 blur-3xl"
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
          className="absolute w-[400px] h-[400px] rounded-full border border-dashed border-emerald-500/20 opacity-50"
        />
      </div>

      {/* --- Glass Header --- */}
      <header className="flex items-center justify-between px-8 py-6 bg-black/40 backdrop-blur-2xl z-20 border-b border-white/5 relative">
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="flex items-center gap-6">
          <div className="relative">
            <motion.div 
              animate={{ rotate: isLoading ? 360 : 0 }} 
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 rounded-full border border-dashed border-primary/40"
            />
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] backdrop-blur-md relative z-10">
              <Bot className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h2 className="font-extrabold text-xl flex items-center gap-3 text-white tracking-wide">
              {isInterview ? "AI Interview Protocol" : "Communication AI Matrix"}
              <span className="text-[10px] bg-primary/20 text-primary px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-primary/30">
                {topic.replace('-', ' ')}
              </span>
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                {/* Voice Waveform Animation when Loading */}
                <div className="flex items-center gap-[2px] h-3">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={isLoading ? { height: ["20%", "100%", "20%"] } : { height: "20%" }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                      className="w-1 bg-emerald-400 rounded-full"
                    />
                  ))}
                </div>
                <span className="text-xs text-emerald-400 font-mono tracking-widest uppercase">
                  {isLoading ? "Synthesizing" : "Standby"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono tracking-widest uppercase">
                <ShieldCheck className="w-3 h-3" /> Encrypted & Secured
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={handleEndSession}
          className="group text-xs font-bold text-red-400 hover:text-white px-5 py-3 rounded-lg flex items-center transition-all border border-red-500/30 hover:bg-red-500/20 backdrop-blur-md uppercase tracking-wider"
        >
          <Square className="w-3 h-3 mr-2 fill-current group-hover:animate-pulse" /> Terminate Link
        </button>
      </header>

      {/* --- Main Content Area (Dual Pane Support) --- */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative z-10">
        
        {/* Left/Main Pane: Chat Interface */}
        <div className={`flex flex-col h-full ${roundData?.type === 'coding' ? 'lg:w-1/2 border-r border-white/5' : 'w-full'}`}>
          <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth custom-scrollbar">
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
                className="flex items-center gap-4 text-primary text-sm font-mono mt-8 p-5 rounded-2xl bg-primary/5 border border-primary/20 w-fit backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.1)]"
              >
                <Loader2 className="w-5 h-5 animate-spin" /> 
                <span className="tracking-widest uppercase">Processing Response...</span>
              </motion.div>
            )}
            <div ref={bottomRef} className="h-10" />
          </div>

          {/* Futuristic Input Area */}
          <div className="p-6 md:p-8 bg-black/40 backdrop-blur-2xl z-20 border-t border-white/5 relative">
            <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <form 
              onSubmit={handleSubmit} 
              className="relative max-w-4xl mx-auto flex items-end gap-4"
            >
              <div className="relative flex-1 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />
                
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="INITIALIZE INPUT... [PRESS ENTER TO TRANSMIT]"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-16 py-5 text-sm focus:outline-none focus:ring-0 focus:border-primary/50 text-white placeholder:text-white/30 transition-all resize-none shadow-inner min-h-[64px] max-h-[200px] font-mono relative z-10 backdrop-blur-md"
                  disabled={isLoading}
                  rows={1}
                />
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 transition-colors z-20 flex items-center ${isRecording ? 'text-red-500' : 'text-white/40 hover:text-primary'}`}
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
                  disabled={!input.trim() && !code.trim()}
                  className="p-5 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 h-[64px] w-[64px] flex items-center justify-center shrink-0 border border-primary/50 disabled:shadow-none relative overflow-hidden group"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Send className="w-6 h-6 relative z-10" />
                </motion.button>
              )}
            </form>
            
            <div className="text-center mt-5 text-[9px] text-white/30 font-mono uppercase tracking-[0.2em] flex items-center justify-center gap-3">
              <Activity className="w-3 h-3 text-primary" />
              Neural Link Active // Strict Persona Enforced // Warning: AI outputs may vary
            </div>
          </div>
        </div>

        {/* Right Pane: Code Editor (Only for coding rounds) */}
        {roundData?.type === 'coding' && (
          <div className="hidden lg:flex flex-col w-1/2 h-full bg-[#1e1e1e]">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-6 py-3 bg-[#252526] border-b border-[#3c3c3c]">
              <div className="text-xs font-mono text-white/50 uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Integrated IDE
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-[#3c3c3c] text-white text-xs font-mono px-3 py-1.5 rounded-md border-none focus:ring-1 focus:ring-primary outline-none cursor-pointer"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
                <option value="sql">SQL</option>
              </select>
            </div>
            {/* Editor Body */}
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  padding: { top: 20 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  formatOnPaste: true,
                }}
                loading={
                  <div className="flex h-full items-center justify-center text-white/20 font-mono text-sm animate-pulse">
                    Initializing Editor Engine...
                  </div>
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
