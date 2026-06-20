"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  BarChart3, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  ExternalLink,
  MessageSquare,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SessionDetail({ params }: { params: { id: string } }) {
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchDetail = async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select(`
          *,
          evaluations (
            evaluation_json
          )
        `)
        .eq("id", params.id)
        .single();

      if (data) {
        setSessionData(data);
      }
      setLoading(false);
    };

    fetchDetail();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!sessionData || !sessionData.evaluations || sessionData.evaluations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Evaluation Pending or Not Found</h2>
        <p className="text-muted-foreground mb-6">This session might still be processing or was terminated early.</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const evaluation = sessionData.evaluations[0].evaluation_json;
  const isInterview = sessionData.mode === "interview";
  const overallScore = Math.round((evaluation.fluencyScore + evaluation.grammarScore + evaluation.confidenceScore + evaluation.technicalScore) / 4);

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to History
          </button>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isInterview ? 'bg-indigo-500/10 text-indigo-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              {isInterview ? <Target className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight uppercase text-foreground">
                {isInterview ? "Interview Evaluation" : "Coaching Feedback"}
              </h1>
              <div className="text-sm font-mono text-muted-foreground mt-1">
                SESSION ID: {sessionData.id.split('-')[0]} // {new Date(sessionData.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="col-span-2 md:col-span-1 bg-primary/10 border border-primary/30 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2">Overall</span>
            <span className="text-4xl font-black text-foreground">{overallScore}%</span>
          </div>
          {[
            { label: "Fluency", val: evaluation.fluencyScore },
            { label: "Grammar", val: evaluation.grammarScore },
            { label: "Confidence", val: evaluation.confidenceScore },
            { label: "Technical", val: evaluation.technicalScore },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2 block">{stat.label}</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-foreground">{stat.val}</span>
                <span className="text-sm text-muted-foreground pb-1">%</span>
              </div>
              <div className="w-full h-1 bg-muted rounded-full mt-4 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${stat.val >= 90 ? 'bg-indigo-500' : stat.val >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${stat.val}%` }} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Feedback */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold uppercase tracking-wide">Analysis Summary</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed font-mono text-sm">
            {evaluation.overallFeedback}
          </p>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Strengths</h2>
            </div>
            <ul className="space-y-4">
              {evaluation.strengths?.length > 0 ? evaluation.strengths.map((str: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm font-mono text-muted-foreground">
                  <span className="text-emerald-500 mt-0.5">•</span> {str}
                </li>
              )) : (
                <li className="text-sm font-mono text-muted-foreground">No specific strengths highlighted in this short session.</li>
              )}
            </ul>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">Areas for Improvement</h2>
            </div>
            <ul className="space-y-4">
              {evaluation.corrections?.length > 0 ? evaluation.corrections.map((corr: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm font-mono text-muted-foreground">
                  <span className="text-amber-500 mt-0.5">•</span> {corr}
                </li>
              )) : (
                <li className="text-sm font-mono text-muted-foreground">No specific corrections needed!</li>
              )}
            </ul>
          </div>
        </div>

        {/* Actionable AI Resources */}
        {evaluation.recommendedResources && evaluation.recommendedResources.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono tracking-widest uppercase mb-6">
              <BookOpen className="w-3 h-3" /> AI Curated Learning Path
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Actionable Resources</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evaluation.recommendedResources.map((res: any, i: number) => (
                <a 
                  key={i} 
                  href={res.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-card border border-border hover:border-primary/50 p-6 rounded-2xl shadow-sm transition-all relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute inset-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite]" />
                  
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{res.title}</h3>
                      <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mb-4 line-clamp-3">{res.description}</p>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-xl border border-border mt-auto">
                    <p className="text-[10px] uppercase font-mono tracking-widest text-primary mb-1">Why this helps:</p>
                    <p className="text-xs text-foreground font-medium">{res.reason}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
