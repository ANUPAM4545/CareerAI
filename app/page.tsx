"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
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
  Star,
  ChevronDown,
  LineChart,
  BrainCircuit,
  GraduationCap,
  Moon,
  Sun,
  ArrowUp,
  Terminal,
  Heart
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar 
} from "recharts";

// --- Mock Data ---
const radarData = [
  { subject: 'Clarity', A: 84, fullMark: 100 },
  { subject: 'Confidence', A: 79, fullMark: 100 },
  { subject: 'Grammar', A: 91, fullMark: 100 },
  { subject: 'Fluency', A: 87, fullMark: 100 },
  { subject: 'Tech', A: 82, fullMark: 100 },
];

const areaData = [
  { name: 'W1', score: 65 },
  { name: 'W2', score: 72 },
  { name: 'W3', score: 78 },
  { name: 'W4', score: 85 },
  { name: 'W5', score: 89 },
];

const faqs = [
  { q: "How does CareerSpeak AI work?", a: "You select a target role, and our AI conducts a realistic mock interview. You can answer using your microphone or keyboard. Instantly after your response, the AI analyzes your fluency, grammar, and technical accuracy to provide actionable feedback." },
  { q: "Can I practice with voice and text?", a: "Yes! We highly recommend voice mode to practice your speaking skills and reduce filler words, but text mode is fully supported if you prefer typing or are in a quiet environment." },
  { q: "Which interview roles are supported?", a: "We support dozens of roles out-of-the-box, including Software Engineering, Product Management, Data Science, Marketing, and HR. You can also customize the AI for very specific niche roles." },
  { q: "Is my data secure?", a: "Absolutely. We use enterprise-grade encryption and your practice audio is processed securely. We never sell your personal data or interview transcripts." },
  { q: "Is there a free plan?", a: "Yes, we offer a generous free forever plan that lets you experience the core interview features and get actionable feedback." },
];

// --- Animation Variants ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, setTheme } = useTheme();
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(true);

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

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isDesktop]);

  useEffect(() => {
    if (isDemoOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isDemoOpen]);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans overflow-hidden transition-colors duration-300">
      
      {/* Developer Aesthetic Cursor */}
      {isDesktop && (
        <motion.div
          className="fixed top-0 left-0 w-6 h-6 rounded-full border border-foreground/30 pointer-events-none z-[100] mix-blend-difference hidden md:block"
          animate={{ x: mousePosition.x - 12, y: mousePosition.y - 12 }}
          transition={{ type: "spring", stiffness: 800, damping: 40, mass: 0.2 }}
        />
      )}

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent py-2"}`}>
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0})}>
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <Terminal className="w-4 h-4 text-background" />
            </div>
            <span className="font-bold text-lg tracking-tight">CareerSpeak</span>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="hidden md:flex items-center gap-8">
            {['how-it-works', 'features', 'analytics'].map((id) => (
              <Link 
                key={id} 
                href={`#${id}`} 
                className={`text-sm font-medium transition-colors ${activeSection === id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Link>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Log In</Link>
            <Link href="/signup" className="h-9 px-4 inline-flex items-center justify-center rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
              Deploy Skills
            </Link>
          </motion.div>

          <div className="md:hidden flex items-center gap-4 z-50">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "100vh" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden fixed inset-0 top-16 bg-background border-t border-border px-6 py-8 flex flex-col gap-6"
            >
              {['how-it-works', 'features', 'analytics'].map((id) => (
                <Link 
                  key={id} 
                  href={`#${id}`} 
                  onClick={() => setMobileMenuOpen(false)} 
                  className={`text-xl font-medium ${activeSection === id ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Link>
              ))}
              <hr className="border-border" />
              <Link href="/login" className="text-xl font-medium text-muted-foreground">Log In</Link>
              <Link href="/signup" className="w-full h-12 mt-2 inline-flex items-center justify-center rounded-md bg-foreground text-background font-medium text-lg">
                Get Started
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm px-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden border border-border shadow-2xl"
            >
              <button 
                onClick={() => setIsDemoOpen(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 hover:bg-black/80 rounded-md flex items-center justify-center transition-colors border border-white/10"
              >
                <X className="w-4 h-4 text-white" />
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

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Col */}
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col items-start">
              <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.05] mb-6 text-foreground">
                Compile your <br className="hidden lg:block"/>
                communication skills.
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-[500px]">
                An AI-driven environment to practice interviews, debug your professional English, and deploy with confidence.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-8">
                <Link href="/signup" className="w-full sm:w-auto h-12 px-8 inline-flex items-center justify-center rounded-md bg-foreground text-background font-medium hover:opacity-90 transition-opacity">
                  Initialize Practice
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <button 
                  onClick={() => setIsDemoOpen(true)} 
                  className="w-full sm:w-auto h-12 px-8 inline-flex items-center justify-center rounded-md border border-border bg-background hover:bg-muted text-foreground font-medium transition-colors"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Demo
                </button>
              </motion.div>
            </motion.div>

            {/* Right Col: Minimal Wireframe Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full aspect-square max-w-[500px] mx-auto lg:ml-auto"
            >
              <div className="w-full h-full bg-card border border-border rounded-xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center border border-border">
                      <Terminal className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground">System.Design.Interview</div>
                      <div className="text-xs text-muted-foreground font-mono">Status: Recording...</div>
                    </div>
                  </div>
                  <div className="text-muted-foreground text-xs font-mono">02:14</div>
                </div>

                {/* Minimal Waveform */}
                <div className="flex-1 flex items-center justify-center py-10">
                  <div className="flex items-center gap-1 h-12">
                    {[...Array(12)].map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: [`${Math.random() * 30 + 10}%`, `${Math.random() * 80 + 20}%`, `${Math.random() * 30 + 10}%`] }}
                        transition={{ repeat: Infinity, duration: Math.random() * 0.8 + 0.5, ease: "easeInOut" }}
                        className="w-1.5 bg-foreground rounded-full"
                      />
                    ))}
                  </div>
                </div>

                {/* Feedback Panel */}
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-foreground flex items-center gap-2">
                      <Zap className="w-3 h-3" /> Runtime Analysis
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground bg-background px-2 py-0.5 rounded border border-border">
                      optimization_found: true
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Fluency", score: "88%" },
                      { label: "Grammar", score: "92%" },
                    ].map((stat, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{stat.label}</span>
                          <span className="font-mono">{stat.score}</span>
                        </div>
                        <div className="h-1 w-full bg-background border border-border rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: stat.score }} 
                            transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                            className="h-full bg-foreground rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF (Marquee) --- */}
      <section className="py-8 border-y border-border bg-background overflow-hidden relative">
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="w-full inline-flex flex-nowrap overflow-hidden">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="flex items-center gap-16 md:gap-32 pr-16 md:pr-32 opacity-40 hover:opacity-80 transition-opacity duration-300 w-max"
          >
            {['Vercel', 'Linear', 'Raycast', 'Stripe', 'GitHub', 'Next.js', 'Vercel', 'Linear', 'Raycast', 'Stripe', 'GitHub', 'Next.js'].map((company, i) => (
              <span key={i} className="text-xl md:text-2xl font-bold font-sans tracking-tight text-foreground whitespace-nowrap">{company}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-24 relative bg-muted/20">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Architecture</h2>
            <p className="text-muted-foreground text-lg">A systematic approach to interview preparation.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Terminal, step: "01", title: "Configure Role", desc: "Define your target parameters: Software Engineer, Product Manager, or Custom Profile." },
              { icon: Mic, step: "02", title: "Execute Interview", desc: "Interact via voice or CLI-style text input in a low-latency environment." },
              { icon: LineChart, step: "03", title: "Analyze Logs", desc: "Review structural feedback, grammar diffs, and quantitative metrics." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group border border-border bg-card p-8 rounded-xl hover:border-foreground/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-8">
                  <item.icon className="w-5 h-5 text-foreground" />
                  <span className="text-xs font-mono text-muted-foreground">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-24 relative border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Core Modules</h2>
            <p className="text-muted-foreground text-lg">Everything required for a successful build.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Mic, title: "I/O Flexibility", desc: "Support for both audio and text streams during practice." },
              { icon: MessageSquare, title: "Syntax Correction", desc: "Real-time parsing and optimization of your professional English." },
              { icon: BarChart3, title: "Telemetry", desc: "Comprehensive dashboards tracking fluency, pacing, and filler words." },
              { icon: BrainCircuit, title: "Adaptive Models", desc: "AI personas that adjust difficulty based on your performance." },
              { icon: Shield, title: "Secure Environments", desc: "Your transcripts and audio are processed securely and never shared." },
              { icon: Zap, title: "Low Latency", desc: "Sub-second response times for a natural conversational flow." },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 border border-border bg-card rounded-xl hover:bg-muted/50 transition-colors"
              >
                <feature.icon className="w-5 h-5 text-foreground mb-4" />
                <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ANALYTICS PREVIEW --- */}
      <section id="analytics" className="py-24 relative border-t border-border bg-muted/10">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">Metrics that matter.</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Stop guessing. Our telemetry dashboard breaks down your exact strengths and weaknesses across qualitative and quantitative vectors.
              </p>
              
              <ul className="space-y-4 mb-8 font-mono text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-foreground" /> [OK] Aggregated performance history
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-foreground" /> [OK] Dimensional skill analysis
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-foreground" /> [OK] Filler word regression tracking
                </li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative bg-card border border-border rounded-xl p-6 shadow-xl"
            >
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-background p-4 rounded-lg border border-border">
                  <div className="text-muted-foreground text-xs mb-1 font-mono">avg_clarity</div>
                  <div className="text-2xl font-bold text-foreground">84%</div>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border">
                  <div className="text-muted-foreground text-xs mb-1 font-mono">sys_confidence</div>
                  <div className="text-2xl font-bold text-foreground">79%</div>
                </div>
              </div>

              <div className="h-[200px] w-full bg-background rounded-lg border border-border p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient id="monochromeScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="currentColor" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="score" stroke="currentColor" className="text-foreground" strokeWidth={2} fillOpacity={1} fill="url(#monochromeScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-24 border-t border-border">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-12">Documentation</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-border last:border-0 pb-4">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-2 text-left"
                >
                  <span className="font-medium text-foreground">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${activeFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="text-sm text-muted-foreground leading-relaxed pt-2 overflow-hidden"
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
      <section className="py-32 border-t border-border bg-foreground text-background text-center">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to initialize?
          </h2>
          <p className="text-background/70 text-lg mb-10 max-w-xl mx-auto">
            Deploy your career communication skills today. Free access to core modules.
          </p>
          <Link href="/signup" className="h-12 px-8 inline-flex items-center justify-center rounded-md bg-background text-foreground font-semibold hover:bg-background/90 transition-colors">
            $ sudo start
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-background pt-16 pb-8 border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-foreground" />
                <span className="font-bold text-foreground">CareerSpeak</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI communication layer for your career.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#faq" className="hover:text-foreground">Documentation & API</Link></li>
                <li><Link href="#" className="hover:text-foreground">GitHub Open Source</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <div>© 2026 CareerSpeak.</div>
            <div className="flex items-center gap-1 font-mono">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500 mx-1 animate-pulse" /> by Anupam Singh
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
