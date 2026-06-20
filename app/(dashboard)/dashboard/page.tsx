"use client";

import { useEffect, useState } from "react";
import { 
  ArrowRight, 
  Terminal, 
  Mic, 
  LineChart, 
  Clock,
  Zap,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from "recharts";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user's sessions
      const { data: sessionData } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (sessionData) {
        setSessions(sessionData);
        
        // Fetch evaluations for these sessions
        const sessionIds = sessionData.map(s => s.id);
        if (sessionIds.length > 0) {
          const { data: evalData } = await supabase
            .from("evaluations")
            .select("*")
            .in("session_id", sessionIds);
            
          if (evalData) setEvaluations(evalData);
        }
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Calculate Metrics
  const totalSessions = sessions.length;
  
  let avgOverallScore = 0;
  let avgTechScore = 0;
  let chartData: any[] = [];
  let recentLogs: any[] = [];

  if (evaluations.length > 0) {
    let totalScoreSum = 0;
    let techScoreSum = 0;

    // Build chart data (chronological)
    const sortedEvals = [...evaluations].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    sortedEvals.forEach((ev, i) => {
      const overall = Math.round((ev.fluency + ev.grammar + ev.confidence + (ev.technical_accuracy || ev.confidence)) / 4);
      totalScoreSum += overall;
      techScoreSum += (ev.technical_accuracy || ev.confidence);
      
      chartData.push({
        name: `S${i+1}`,
        score: overall
      });
    });

    avgOverallScore = Math.round(totalScoreSum / evaluations.length);
    avgTechScore = Math.round(techScoreSum / evaluations.length);

    // Build recent logs
    recentLogs = sessions.slice(0, 5).map(s => {
      const ev = evaluations.find(e => e.session_id === s.id);
      let score = 0;
      if (ev) {
        score = Math.round((ev.fluency + ev.grammar + ev.confidence + (ev.technical_accuracy || ev.confidence)) / 4);
      }
      return {
        title: s.track_id ? `${s.track_id.toUpperCase()} - ${s.round_id || 'Round'}` : `${s.mode}_module`,
        date: new Date(s.created_at).toLocaleDateString(),
        score: score
      };
    });
  }

  // Handle Empty State
  if (totalSessions === 0) {
    return (
      <div className="p-6 md:p-10 max-w-[1280px] mx-auto w-full h-full flex flex-col font-sans">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <Terminal className="w-8 h-8 text-muted-foreground" />
              Telemetry Dashboard
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Runtime analysis and performance metrics for your communication modules.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-20"
        >
          <div className="w-24 h-24 bg-card rounded-2xl flex items-center justify-center border border-border mb-8 shadow-xl shadow-foreground/5">
            <Mic className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4">No Telemetry Data Found</h3>
          <p className="text-muted-foreground mb-8 text-lg">
            Your runtime environment has zero logged sessions. Initialize a practice module to begin accumulating performance metrics and ai-driven evaluations.
          </p>
          <Link 
            href="/practice" 
            className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
          >
            <Zap className="w-5 h-5 fill-current" />
            Initialize First Practice
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-[1280px] mx-auto w-full space-y-10 font-sans">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Terminal className="w-8 h-8 text-muted-foreground" />
            Telemetry Dashboard
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Runtime analysis and performance metrics for your communication modules.
          </p>
        </div>
        <Link 
          href="/practice" 
          className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Mic className="w-4 h-4" />
          Initialize Practice
        </Link>
      </motion.div>

      {/* KPI Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants} className="bg-card p-6 rounded-xl border border-border hover:border-foreground/30 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <LineChart className="w-24 h-24 text-foreground" />
          </div>
          <div className="flex flex-col h-full relative z-10">
            <p className="text-sm font-mono text-muted-foreground mb-4">sys_score.overall</p>
            <h3 className="text-4xl font-bold text-foreground mb-2">{avgOverallScore}%</h3>
            <div className="text-xs text-foreground bg-foreground/10 self-start px-2 py-1 rounded font-mono mt-auto">
              [OK] Active telemetry
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card p-6 rounded-xl border border-border hover:border-foreground/30 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-24 h-24 text-foreground" />
          </div>
          <div className="flex flex-col h-full relative z-10">
            <p className="text-sm font-mono text-muted-foreground mb-4">runtime.total_sessions</p>
            <h3 className="text-4xl font-bold text-foreground mb-2">{totalSessions}</h3>
            <div className="text-xs text-foreground bg-foreground/10 self-start px-2 py-1 rounded font-mono mt-auto">
              [LOG] Sessions executed
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card p-6 rounded-xl border border-border hover:border-foreground/30 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-24 h-24 text-foreground" />
          </div>
          <div className="flex flex-col h-full relative z-10">
            <p className="text-sm font-mono text-muted-foreground mb-4">sys_score.technical</p>
            <h3 className="text-4xl font-bold text-foreground mb-2">{avgTechScore}%</h3>
            <div className="text-xs text-foreground bg-foreground/10 self-start px-2 py-1 rounded font-mono mt-auto">
              [OPT] Tech accuracy vector
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-xl relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <LineChart className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-bold text-foreground">Performance Trend Vector</h3>
            </div>
            <div className="bg-background border border-border text-foreground rounded px-3 py-1 text-xs font-mono">
              [ all time ]
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-[250px]">
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="monochromeScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="currentColor" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.5, fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.5, fontSize: 12}} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                    cursor={{stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '5 5', opacity: 0.2}}
                  />
                  <Area type="monotone" dataKey="score" stroke="currentColor" className="text-foreground" strokeWidth={2} fillOpacity={1} fill="url(#monochromeScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground font-mono text-sm">
                [ Waiting for more data points... ]
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card rounded-xl border border-border p-6 shadow-xl flex flex-col relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Terminal className="w-4 h-4 text-muted-foreground" /> Execution Logs
            </h3>
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2">
            {recentLogs.map((session, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:border-foreground/30 transition-colors group cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-mono text-sm text-foreground group-hover:text-foreground transition-colors">{session.title}</span>
                  <span className="text-xs text-muted-foreground">{session.date}</span>
                </div>
                <div className="font-bold text-foreground">
                  {session.score}%
                </div>
              </div>
            ))}
          </div>

          <Link href="/history" className="mt-6 w-full py-3 flex items-center justify-center gap-2 text-sm font-medium border border-border bg-background hover:bg-muted text-foreground transition-colors rounded-lg">
            View Full Logs <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
