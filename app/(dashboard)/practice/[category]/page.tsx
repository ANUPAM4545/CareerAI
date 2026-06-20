"use client";

import { motion } from "framer-motion";
import { 
  Terminal, Database, Briefcase, 
  Landmark, Building2, 
  LineChart, Calculator, 
  HeartPulse, Stethoscope, 
  Users, DollarSign, MessageSquare,
  Bot, Globe
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const domainData: Record<string, { title: string, description: string, iconColor: string, bgColor: string, roles: any[] }> = {
  tech: {
    title: "Tech Hub",
    description: "Software Engineering, Product Management, Data, and Cybersecurity.",
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    roles: [
      { trackId: "software-engineer", title: "Software Engineer", desc: "System Design, DSA, Full-stack.", icon: Terminal },
      { trackId: "swe-intern", title: "Software Engineering Intern", desc: "CS fundamentals, basic algorithms.", icon: Terminal },
      { trackId: "product-manager", title: "Product Manager", desc: "Product sense, metrics, strategy.", icon: Briefcase },
      { trackId: "data-scientist", title: "Data Scientist", desc: "SQL, Stats, Machine Learning.", icon: Database },
      { trackId: "security-engineer", title: "Security Engineer", desc: "AppSec, Pen testing, OWASP.", icon: Terminal },
      { trackId: "web-developer", title: "Web Developer", desc: "React, JS/TS, Frontend Architecture.", icon: Globe },
      { trackId: "ai-ml-engineer", title: "AI/ML Engineer", desc: "PyTorch, Neural Nets, ML System Design.", icon: Database },
      { trackId: "gen-ai-engineer", title: "GenAI Engineer", desc: "LLMs, RAG, Prompt Engineering, Evals.", icon: Bot }
    ]
  },
  government: {
    title: "Government Services",
    description: "UPSC, Civil Services, and Public Sector panel interviews.",
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
    roles: [
      { trackId: "civil-services", title: "Civil Services Board", desc: "UPSC/State PSC rigorous panel.", icon: Landmark },
      { trackId: "public-sector", title: "Public Sector (PSU)", desc: "Technical and administrative roles.", icon: Building2 }
    ]
  },
  business: {
    title: "Business & Consulting",
    description: "High-stakes corporate roles requiring rapid analytical thinking.",
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    roles: [
      { trackId: "management-consultant", title: "Management Consultant", desc: "McKinsey/BCG case studies.", icon: LineChart },
      { trackId: "investment-banker", title: "Investment Banker", desc: "Financial modeling, valuations.", icon: Calculator },
      { trackId: "enterprise-sales", title: "B2B Enterprise Sales", desc: "Objection handling, cold calls.", icon: Briefcase }
    ]
  },
  healthcare: {
    title: "Healthcare & Medicine",
    description: "Highly specialized interviews focusing on ethics and situational judgment.",
    iconColor: "text-rose-500",
    bgColor: "bg-rose-500/10",
    roles: [
      { trackId: "medical-residency", title: "Medical Residency", desc: "MMI and medical ethics.", icon: Stethoscope },
      { trackId: "patient-care", title: "Patient Care Coordinator", desc: "Empathy, crisis management.", icon: HeartPulse }
    ]
  },
  behavioral: {
    title: "Behavioral & Communication",
    description: "The universal skills required to pass HR rounds and negotiate salary.",
    iconColor: "text-violet-500",
    bgColor: "bg-violet-500/10",
    roles: [
      { trackId: "hr-culture-fit", title: "HR Culture Fit", desc: "STAR method, teamwork, conflict.", icon: Users },
      { trackId: "salary-negotiation", title: "Salary Negotiation", desc: "Practice confident negotiation.", icon: DollarSign },
      { trackId: "professional-english", title: "Professional English", desc: "Corporate communication prep.", icon: MessageSquare }
    ]
  }
};

export default function CategoryPage({ params }: { params: { category: string } }) {
  const router = useRouter();
  const categoryData = domainData[params.category];

  if (!categoryData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <button onClick={() => router.push('/dashboard')} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg">Go back</button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8 relative">
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary-rgb),0.05)_0%,transparent_50%)] pointer-events-none`} />
      
      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${categoryData.bgColor}`}>
            <Briefcase className={`w-8 h-8 ${categoryData.iconColor}`} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">{categoryData.title}</h1>
            <p className="text-muted-foreground font-mono mt-1">{categoryData.description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryData.roles.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                href={`/practice/track/${role.trackId}`}
                className="block group bg-card border border-border hover:border-primary/50 p-6 rounded-3xl shadow-sm transition-all relative overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite]" />
                
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-muted border border-border group-hover:border-primary/30 transition-colors`}>
                    <role.icon className={`w-6 h-6 text-foreground group-hover:text-primary transition-colors`} />
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground px-2 py-1 bg-muted rounded-full">
                    VIEW TRACK
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{role.title}</h3>
                <p className="text-sm text-muted-foreground font-mono">{role.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
