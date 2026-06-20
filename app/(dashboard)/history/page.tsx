"use client";

import { motion } from "framer-motion";
import { Mic, MessageSquare, Target, Clock, Calendar, ArrowUpRight, Search, Filter, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function HistoryPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data, error } = await supabase
        .from("sessions")
        .select(`
          *,
          evaluations (
            evaluation_json
          )
        `)
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (data) {
        // Map the database sessions to the UI format
        const formattedSessions = data.map((s) => {
          const evalData = s.evaluations?.[0]?.evaluation_json;
          
          let score = 0;
          if (evalData) {
            score = Math.round((evalData.fluencyScore + evalData.grammarScore + evalData.confidenceScore + evalData.technicalScore) / 4);
          }

          const isInterview = s.mode === "interview";

          return {
            id: s.id,
            title: isInterview ? "Mock Technical Interview" : "Professional English Coach",
            date: new Date(s.created_at).toLocaleDateString() + ", " + new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            duration: "Session", // We aren't tracking duration yet
            score: score || 0,
            type: isInterview ? "Technical" : "Coaching",
            icon: isInterview ? Target : MessageSquare,
            color: isInterview ? "text-indigo-500" : "text-emerald-500",
            bg: isInterview ? "bg-indigo-500/10" : "bg-emerald-500/10",
            hasEval: !!evalData,
          };
        });
        setSessions(formattedSessions);
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  const totalSessions = sessions.length;
  const avgScore = totalSessions > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / sessions.filter(s => s.hasEval).length || 1) : 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Session History</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review your past practice sessions and track your progress.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Total Sessions", value: totalSessions },
              { label: "Average Score", value: isNaN(avgScore) ? 0 : avgScore },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* History List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5 text-sm text-slate-500 dark:text-slate-400">
                    <th className="px-6 py-4 font-medium">Session Details</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {sessions.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-slate-500">
                        No sessions found. Start a practice session to see it here!
                      </td>
                    </tr>
                  ) : (
                    sessions.map((session, i) => (
                      <tr 
                        key={session.id} 
                        onClick={() => window.location.href = `/history/${session.id}`}
                        className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${session.bg}`}>
                              <session.icon className={`w-5 h-5 ${session.color}`} />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{session.title}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {session.date}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {session.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {session.hasEval ? (
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2 flex-1">
                                <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${session.score >= 90 ? 'bg-indigo-500' : session.score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                    style={{ width: `${session.score}%` }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{session.score}</span>
                              </div>
                              <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">Processing...</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
