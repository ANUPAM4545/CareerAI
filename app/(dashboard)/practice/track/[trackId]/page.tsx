"use client";

import { motion } from "framer-motion";
import { 
  Terminal, Play, ArrowLeft, 
  BrainCircuit, CheckCircle2, 
  Clock, ShieldAlert,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tracks } from "@/lib/data/tracks";

export default function TrackDashboard({ params }: { params: { trackId: string } }) {
  const router = useRouter();
  const track = (tracks as any)[params.trackId];

  if (!track) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold mb-4">Track not found</h1>
        <button onClick={() => router.back()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Go back</button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary-rgb),0.05)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 space-y-12 pb-20">
        
        {/* Header */}
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-primary/10 border border-primary/20">
              <Terminal className="w-8 h-8 text-primary" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-primary">Interview Track</span>
              <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">{track.title}</h1>
            </div>
          </div>
        </div>

        {/* AI Persona & Skills Grid */}
        <div className="grid md:grid-cols-5 gap-6">
          {/* Persona Card */}
          <div className="col-span-2 bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <BrainCircuit className="w-5 h-5 text-primary" />
              <h3 className="font-bold uppercase tracking-wide">Your Interviewer</h3>
            </div>
            <div className="relative z-10">
              <p className="text-2xl font-black">{track.interviewer.name}</p>
              <p className="text-sm text-muted-foreground font-mono mt-1">{track.interviewer.role}</p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-amber-500 bg-amber-500/10 px-3 py-2 rounded-lg relative z-10">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Strict AI guardrails active.</span>
            </div>
          </div>

          {/* Skills Card */}
          <div className="col-span-3 bg-card border border-border p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h3 className="font-bold uppercase tracking-wide">Required Skills Evaluated</h3>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {track.skills.map((skill: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted border border-border rounded-lg text-xs font-mono text-foreground">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Rounds Timeline */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-wide mb-6">Track Progression</h2>
          
          <div className="relative border-l-2 border-muted ml-6 md:ml-8 space-y-12 pb-8">
            {track.rounds.map((round: any, i: number) => (
              <motion.div 
                key={round.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative pl-8 md:pl-12"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-background border-4 border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
                
                <div className="bg-card border border-border hover:border-primary/50 p-6 md:p-8 rounded-3xl shadow-sm transition-colors group">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{round.title}</h3>
                      <p className="text-sm text-muted-foreground font-mono leading-relaxed max-w-xl">{round.desc}</p>
                      
                      <div className="flex items-center gap-2 mt-4 text-xs font-mono text-muted-foreground">
                        <Clock className="w-4 h-4" /> Expected duration: {round.time}
                      </div>
                    </div>
                    
                    <Link
                      href={`/session/interview?track=${params.trackId}&round=${round.id}&persona=${track.interviewer.personaId}`}
                      className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity uppercase tracking-widest text-xs"
                    >
                      <Play className="w-4 h-4" /> Start Round
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
