"use client";

import { motion } from "framer-motion";
import { 
  Dumbbell, Code, Database, Users, 
  MessageSquare, Briefcase, 
  Play, Presentation, BrainCircuit, Target
} from "lucide-react";
import Link from "next/link";

const sandboxSkills = [
  {
    category: "Technical Skills",
    icon: Code,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    skills: [
      { id: "sql-optimization", name: "SQL Optimization", desc: "Practice indexing and query plans." },
      { id: "react-hooks", name: "React Performance", desc: "Identify unnecessary re-renders." },
      { id: "system-design", name: "System Scalability", desc: "Load balancing & caching strategies." },
      { id: "api-design", name: "REST API Design", desc: "Endpoints, status codes, and security." }
    ]
  },
  {
    category: "Behavioral & Soft Skills",
    icon: Users,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    skills: [
      { id: "star-method", name: "The STAR Method", desc: "Structure your behavioral stories." },
      { id: "conflict-resolution", name: "Conflict Resolution", desc: "De-escalate workplace disagreements." },
      { id: "salary-negotiation", name: "Salary Negotiation", desc: "Practice countering a lowball offer." },
      { id: "leadership", name: "Leadership Scenarios", desc: "Motivating an underperforming team." }
    ]
  },
  {
    category: "Business & Sales",
    icon: Briefcase,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    skills: [
      { id: "cold-calling", name: "Cold Calling", desc: "Bypass the gatekeeper and pitch." },
      { id: "objection-handling", name: "Objection Handling", desc: "Overcome 'we have no budget'." },
      { id: "market-sizing", name: "Market Sizing", desc: "Estimate the market for a niche product." },
      { id: "profitability", name: "Profitability Cases", desc: "Diagnose declining revenue margins." }
    ]
  }
];

export default function SandboxPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8 relative">
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary-rgb),0.05)_0%,transparent_50%)] pointer-events-none`} />
      
      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-primary/10">
            <Dumbbell className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">Skills Sandbox</h1>
            <p className="text-muted-foreground font-mono mt-1">Unproctored, casual practice environment. Receive immediate live feedback from your AI Tutor.</p>
          </div>
        </div>

        <div className="space-y-12">
          {sandboxSkills.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.div 
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-border pb-2">
                  <div className={`p-2 rounded-xl ${section.bg}`}>
                    <Icon className={`w-5 h-5 ${section.color}`} />
                  </div>
                  <h2 className="text-xl font-bold uppercase tracking-widest">{section.category}</h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {section.skills.map((skill) => (
                    <Link
                      key={skill.id}
                      href={`/session/sandbox?skill=${skill.id}`}
                      className="group block relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors shadow-sm hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative z-10">
                        <Target className="w-6 h-6 text-primary mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{skill.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{skill.desc}</p>
                      </div>
                      
                      <div className="mt-6 flex items-center text-xs font-bold text-primary tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                        <Play className="w-3 h-3 mr-2" /> Start Practice
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
