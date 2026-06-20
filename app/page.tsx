"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  Play, 
  CheckCircle2, 
  BarChart3, 
  MessageSquare, 
  Zap, 
  Shield, 
  ArrowRight, 
  Menu, 
  X,
  ChevronDown,
  LineChart,
  BrainCircuit,
  Terminal,
  Activity,
  Heart,
  Sun,
  Moon,
  BookOpen,
  Code
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
} from "recharts";

// --- Mock Data ---
const mockSimulations = [
  {
    role: "System Design Interview",
    status: "Strict Anti-Cheat Enforced",
    aiMessage: "How would you design a highly scalable URL shortener?",
    userMessage: "I would start with a highly available key-value store and a unique ID generator...",
  },
  {
    role: "GenAI Engineering",
    status: "Integrated IDE Active",
    aiMessage: "Please implement a simple Retrieval-Augmented Generation chain in Python.",
    userMessage: "Here is my code: \n```python\ndef RAG_chain(query):\n  context = vector_db.search(query)\n  return llm.generate(context, query)\n```",
  },
  {
    role: "AI/ML Engineering",
    status: "Scenario Seed Generated",
    aiMessage: "Explain the mathematics behind backpropagation in a neural network.",
    userMessage: "Backpropagation calculates the gradient of the loss function with respect to the weights using the chain rule...",
  }
];

const areaData = [
  { name: 'W1', score: 65 },
  { name: 'W2', score: 72 },
  { name: 'W3', score: 78 },
  { name: 'W4', score: 85 },
  { name: 'W5', score: 89 },
];

const faqs = [
  { q: "Do you support coding interviews?", a: "Yes! For technical rounds (like DSA or Web Dev), our platform mounts a dual-pane interface with an integrated Monaco code editor (the engine behind VS Code) so you can write and execute your solutions natively." },
  { q: "How does CareerSpeak AI work?", a: "Select a highly specific domain (e.g., AI/ML, System Design, Enterprise Sales). Our specialized AI expert conducts a realistic mock session. The AI instantly analyzes your code, fluency, and technical accuracy to provide actionable feedback." },
  { q: "Are the AI interviewers realistic?", a: "Extremely. We generate cryptographic seeds for every session, ensuring you never face the exact same scenario twice. Our AI personas are locked down with enterprise guardrails." },
  { q: "Which domains are supported?", a: "We support over 15+ specialized domains spanning Core Engineering (DSA, Full-Stack), Future Tech (GenAI, ML), Consulting, Medical Residency, and Communication Coaching." },
];

// --- Animation Variants ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, type: "spring", stiffness: 100 } }
};

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isDesktop, setIsDesktop] = useState(true);
  const [simIndex, setSimIndex] = useState(0);

  useEffect(() => {
    const simInterval = setInterval(() => {
      setSimIndex((prev) => (prev + 1) % mockSimulations.length);
    }, 6000);
    return () => clearInterval(simInterval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    setIsDesktop(window.matchMedia("(pointer: fine)").matches);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );
    
    document.querySelectorAll("section[id]").forEach((section) => observer.observe(section));

    // For the landing page, we set dark mode by default but allow toggling
    if (!document.documentElement.classList.contains("dark") && !localStorage.getItem("theme")) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isDemoOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isDemoOpen]);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden relative selection:bg-primary/30 transition-colors duration-500">
      
      {/* Advanced Background Grid & Holographic Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-[100%] border border-primary/5 bg-primary/5 blur-[100px]"
        />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-dashed border-primary/10 opacity-30 blur-[2px]"
        />
      </div>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-background/60 backdrop-blur-2xl border-b border-border py-3 shadow-md dark:shadow-[0_0_30px_rgba(0,0,0,0.8)]" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0})}>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground transition-colors">CareerSpeak</span>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="hidden md:flex items-center gap-10">
            {['how-it-works', 'features', 'analytics'].map((id) => (
              <Link 
                key={id} 
                href={`#${id}`} 
                className={`text-[10px] uppercase font-mono tracking-[0.2em] transition-colors relative group ${activeSection === id ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {id.replace(/-/g, ' ')}
                <span className={`absolute -bottom-2 left-0 h-[1px] bg-primary transition-all duration-300 ${activeSection === id ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden md:flex items-center gap-4">
            <button
              onClick={() => {
                const isDark = document.documentElement.classList.contains("dark");
                if (isDark) {
                  document.documentElement.classList.remove("dark");
                  localStorage.setItem("theme", "light");
                } else {
                  document.documentElement.classList.add("dark");
                  localStorage.setItem("theme", "dark");
                }
                window.dispatchEvent(new Event('themechange'));
              }}
              className="p-2 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors flex items-center justify-center border border-border"
              title="Toggle Theme"
            >
              <span className="hidden dark:block"><Sun className="w-4 h-4" /></span>
              <span className="block dark:hidden"><Moon className="w-4 h-4" /></span>
            </button>
            <Link href="/login" className="text-xs uppercase font-mono tracking-widest text-muted-foreground hover:text-foreground transition-colors px-4 py-2">Log In</Link>
            <Link href="/signup" className="relative group px-6 py-2.5 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-all rounded-lg overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10 text-xs font-bold uppercase tracking-widest">Sign Up</span>
            </Link>
          </motion.div>

          <div className="md:hidden flex items-center gap-4 z-50">
            <button
              onClick={() => {
                const isDark = document.documentElement.classList.contains("dark");
                if (isDark) {
                  document.documentElement.classList.remove("dark");
                  localStorage.setItem("theme", "light");
                } else {
                  document.documentElement.classList.add("dark");
                  localStorage.setItem("theme", "dark");
                }
              }}
              className="p-2 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors flex items-center justify-center border border-border"
            >
              <span className="hidden dark:block"><Sun className="w-4 h-4" /></span>
              <span className="block dark:hidden"><Moon className="w-4 h-4" /></span>
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6 text-primary"/> : <Menu className="w-6 h-6 text-foreground"/>}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              className="md:hidden fixed inset-0 top-[72px] bg-background/95 backdrop-blur-3xl border-t border-border px-6 py-10 flex flex-col gap-8 z-40"
            >
              {['how-it-works', 'features', 'analytics'].map((id) => (
                <Link 
                  key={id} 
                  href={`#${id}`} 
                  onClick={() => setMobileMenuOpen(false)} 
                  className={`text-sm uppercase font-mono tracking-[0.2em] ${activeSection === id ? "text-primary" : "text-muted-foreground"}`}
                >
                  [{id.replace(/-/g, ' ')}]
                </Link>
              ))}
              <hr className="border-border" />
              <Link href="/login" className="text-sm uppercase font-mono tracking-widest text-muted-foreground">Log In</Link>
              <Link href="/signup" className="w-full py-4 text-center border border-primary/30 bg-primary/10 text-primary rounded-xl text-sm font-bold uppercase tracking-widest mt-4">
                Sign Up
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- DEMO VIDEO MODAL --- */}
      <AnimatePresence>
        {isDemoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-xl px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden border border-border shadow-2xl"
            >
              <button 
                onClick={() => setIsDemoOpen(false)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-black/50 hover:bg-black border border-white/10 rounded-xl flex items-center justify-center transition-all group"
              >
                <X className="w-5 h-5 text-white/50 group-hover:text-white" />
              </button>
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" 
                title="Demo" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CINEMATIC HERO SECTION --- */}
      <section id="hero" className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 flex flex-col items-center justify-center text-center z-10 min-h-screen">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-4xl mx-auto px-6 relative z-10">
          
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono tracking-[0.2em] uppercase mb-8 shadow-sm">
            <Activity className="w-3 h-3" /> AI-Powered Mock Interviews
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1] mb-8 text-foreground drop-shadow-sm uppercase">
            Ace Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Interviews</span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground font-mono tracking-wide leading-relaxed mb-12 max-w-2xl mx-auto">
            Practice with specialized AI interviewers across 15+ domains. Featuring an integrated IDE for coding, strict anti-cheat proctoring, and instant technical feedback.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
            <Link href="/signup" className="relative group w-full sm:w-auto h-14 px-10 inline-flex items-center justify-center rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-all overflow-hidden border border-border">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10 uppercase tracking-widest text-xs flex items-center">
                Get Started Free <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <button 
              onClick={() => setIsDemoOpen(true)} 
              className="group w-full sm:w-auto h-14 px-10 inline-flex items-center justify-center rounded-xl border border-border bg-card/50 hover:bg-muted text-foreground font-bold transition-all backdrop-blur-md uppercase tracking-widest text-xs"
            >
              <Play className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground transition-colors" />
              Watch Demo
            </button>
          </motion.div>
        </motion.div>

        {/* 3D Dashboard Mockup Overlay */}
        <motion.div 
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, delay: 0.4, type: "spring", bounce: 0.4 }}
          className="w-full max-w-5xl mx-auto mt-24 px-6 perspective-[1000px]"
        >
          <div className="w-full aspect-[21/9] bg-card/80 backdrop-blur-2xl border border-border rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_-20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left relative h-10 w-48 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={simIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <div className="text-sm font-bold tracking-widest uppercase text-foreground truncate">{mockSimulations[simIndex].role}</div>
                      <div className="text-[10px] text-muted-foreground font-mono truncate">Status: {mockSimulations[simIndex].status}</div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {[...Array(8)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [`${Math.random() * 20 + 20}%`, `${Math.random() * 80 + 20}%`, `${Math.random() * 20 + 20}%`] }}
                    transition={{ repeat: Infinity, duration: Math.random() * 0.5 + 0.5 }}
                    className="w-1 bg-emerald-500 rounded-full"
                    style={{ height: '10px' }}
                  />
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 flex flex-col justify-end relative">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
               
               <div className="w-full flex flex-col gap-6 relative z-10">
                 <AnimatePresence mode="wait">
                   <motion.div 
                     key={`ai-${simIndex}`}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     transition={{ duration: 0.4, delay: 0.2 }}
                     className="flex gap-4 max-w-[80%]"
                   >
                     <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                       <BrainCircuit className="w-4 h-4 text-primary" />
                     </div>
                     <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-none shadow-sm">
                       <p className="text-sm text-foreground">{mockSimulations[simIndex].aiMessage}</p>
                     </div>
                   </motion.div>
                 </AnimatePresence>

                 <AnimatePresence mode="wait">
                   <motion.div 
                     key={`user-${simIndex}`}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 20 }}
                     transition={{ duration: 0.4, delay: 1.5 }}
                     className="self-end max-w-[80%] flex gap-4 flex-row-reverse"
                   >
                     <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                       <Mic className="w-4 h-4 text-muted-foreground" />
                     </div>
                     <div className="bg-primary/10 border border-primary/30 p-4 rounded-2xl rounded-tr-none">
                       <p className="text-sm text-foreground">{mockSimulations[simIndex].userMessage}</p>
                     </div>
                   </motion.div>
                 </AnimatePresence>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- SOCIAL PROOF (Marquee) --- */}
      <section className="py-12 border-y border-border bg-muted/30 backdrop-blur-md relative z-10 overflow-hidden">
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="w-full inline-flex flex-nowrap overflow-hidden items-center">
          <span className="absolute left-1/2 -translate-x-1/2 text-[10px] font-mono text-primary uppercase tracking-[0.3em] mb-12 opacity-80 z-20">Trusted By Professionals At</span>
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="flex items-center gap-20 md:gap-40 pr-20 md:pr-40 opacity-40 hover:opacity-100 transition-opacity duration-500 w-max pt-6"
          >
            {['META', 'GOOGLE', 'AMAZON', 'NETFLIX', 'STRIPE', 'OPENAI', 'META', 'GOOGLE', 'AMAZON', 'NETFLIX', 'STRIPE', 'OPENAI'].map((company, i) => (
              <span key={i} className="text-xl md:text-2xl font-black font-sans tracking-widest text-foreground whitespace-nowrap">{company}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6 uppercase">How It Works</h2>
            <p className="text-muted-foreground text-lg font-mono tracking-wide max-w-2xl mx-auto">Master your interviewing skills in four simple steps.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Terminal, step: "Step 01", title: "Choose Your Track", desc: "Select a hyper-specific track like GenAI Engineering, DSA, or B2B Sales." },
              { icon: Shield, step: "Step 02", title: "Proctored Interview", desc: "Enter a full-screen, anti-cheat environment with our strict AI persona." },
              { icon: Code, step: "Step 03", title: "Write Code Natively", desc: "For technical rounds, use our integrated Monaco IDE to write Python, JS, etc." },
              { icon: LineChart, step: "Step 04", title: "Track Progress", desc: "Review detailed grading on your technical accuracy and track performance over time." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group relative border border-border bg-card p-10 rounded-3xl hover:border-primary/30 transition-colors overflow-hidden backdrop-blur-md shadow-sm"
              >
                <div className="absolute inset-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite]" />
                
                <div className="flex items-center justify-between mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center group-hover:scale-110 group-hover:border-primary/30 transition-all duration-500">
                    <item.icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-xs font-mono tracking-widest text-muted-foreground">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 uppercase tracking-wide">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-mono">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section id="features" className="py-32 relative z-10 border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6 uppercase">Powerful Features</h2>
            <p className="text-muted-foreground text-lg font-mono tracking-wide">Everything you need to succeed in your next interview.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Terminal, title: "Integrated IDE", desc: "Write code natively during technical rounds with our Monaco-powered code editor." },
              { icon: Shield, title: "Strict Proctoring", desc: "Enterprise anti-cheat enforcement. 3-strike tab-switching rule." },
              { icon: Mic, title: "Native Voice Interviews", desc: "Speak directly with AI interviewers using our free, built-in Text-to-Speech & Speech-to-Text." },
              { icon: BarChart3, title: "Telemetry Dashboard", desc: "Track your performance history granularly by specific round and track." },
              { icon: Zap, title: "15+ Tech Domains", desc: "Master cutting-edge fields: GenAI, AI/ML, Web Dev, and System Design." },
              { icon: MessageSquare, title: "Technical Grading", desc: "Our AI evaluates time/space complexity, edge cases, and code architecture." },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="group p-8 border border-border bg-card rounded-2xl hover:border-primary/30 transition-all backdrop-blur-sm relative overflow-hidden shadow-sm"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <feature.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary mb-6 transition-colors relative z-10" />
                <h3 className="text-lg font-bold text-foreground mb-3 uppercase tracking-wide relative z-10">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-mono relative z-10">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ANALYTICS PREVIEW --- */}
      <section id="analytics" className="py-32 relative z-10 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono tracking-widest uppercase mb-6 bg-emerald-500/10">
                <CheckCircle2 className="w-3 h-3" /> Dashboard Online
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-8 uppercase">Track Your Progress</h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-mono mb-10 max-w-xl">
                Stop guessing. Our analytics dashboard gives you a clear breakdown of your exact strengths and weaknesses.
              </p>
              
              <ul className="space-y-5 font-mono text-xs text-muted-foreground">
                {['View your complete performance history', 'Detailed technical skill breakdown', 'Track your filler words and grammar'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded border border-primary/30 flex items-center justify-center bg-primary/10 text-primary">
                      <Zap className="w-3 h-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative bg-card border border-border rounded-3xl p-8 backdrop-blur-xl shadow-xl"
            >
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-muted p-6 rounded-2xl border border-border">
                  <div className="text-primary text-[10px] uppercase tracking-widest mb-2 font-mono">Average Clarity</div>
                  <div className="text-4xl font-black text-foreground">84<span className="text-lg text-muted-foreground">%</span></div>
                </div>
                <div className="bg-muted p-6 rounded-2xl border border-border">
                  <div className="text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-widest mb-2 font-mono">Confidence Score</div>
                  <div className="text-4xl font-black text-foreground">79<span className="text-lg text-muted-foreground">%</span></div>
                </div>
              </div>

              <div className="h-[250px] w-full bg-muted rounded-2xl border border-border p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="py-32 border-t border-border relative z-10 bg-muted/20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-black tracking-tight text-foreground mb-16 text-center uppercase">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border bg-card rounded-2xl overflow-hidden backdrop-blur-sm shadow-sm">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-bold text-foreground tracking-wide">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${activeFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed font-mono overflow-hidden border-t border-border pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-40 border-t border-border bg-card relative z-10 overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase text-foreground drop-shadow-sm">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Start</span>?
          </h2>
          <p className="text-muted-foreground font-mono tracking-widest text-sm mb-12 max-w-xl mx-auto">
            START PRACTICING TODAY AND LAND YOUR DREAM JOB. BASIC FEATURES ARE FREE FOREVER.
          </p>
          <Link href="/signup" className="relative group h-16 px-12 inline-flex items-center justify-center rounded-2xl bg-foreground text-background font-black uppercase tracking-widest hover:scale-105 transition-transform duration-300 overflow-hidden shadow-lg">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10 flex items-center">
              Start Practicing <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-background py-12 border-t border-border relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center">
                <Activity className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="font-bold text-foreground tracking-widest uppercase">CareerSpeak</span>
            </div>
            
            <div className="flex items-center gap-8 text-[10px] uppercase font-mono tracking-widest text-muted-foreground">
              <Link href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
              <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Github</Link>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-[10px] text-muted-foreground font-mono uppercase tracking-widest gap-4">
            <div>© 2026 CAREERSPEAK. ALL RIGHTS RESERVED.</div>
            <div className="flex items-center gap-2">
              MADE WITH <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> BY ANUPAM SINGH
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
