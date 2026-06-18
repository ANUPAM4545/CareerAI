"use client";

import { 
  ArrowRight, 
  MessageSquare, 
  Mic, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  AlertTriangle
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

const data = [
  { name: "Mon", score: 65 },
  { name: "Tue", score: 68 },
  { name: "Wed", score: 74 },
  { name: "Thu", score: 72 },
  { name: "Fri", score: 85 },
  { name: "Sat", score: 88 },
  { name: "Sun", score: 92 },
];

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back! Here is an overview of your communication progress.
          </p>
        </div>
        <Link href="/practice" className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-lg shadow-indigo-500/25">
          <Mic className="w-4 h-4" />
          Start Practice
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Overall Score</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">88%</h3>
            </div>
          </div>
          <div className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-4 h-4" />
            +12% from last week
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Practice Time</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">4h 20m</h3>
            </div>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            12 sessions completed
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Filler Words</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">14 Avg</h3>
            </div>
          </div>
          <div className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-4 h-4 rotate-180" />
            -30% from last week
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/5 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Performance Trend</h3>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/5 p-6 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Sessions</h3>
          </div>
          
          <div className="space-y-4 flex-1">
            {[
              { title: "System Design Interview", date: "Today", score: 92, icon: Mic, color: "text-indigo-500", bg: "bg-indigo-500/10" },
              { title: "Team Meeting Intro", date: "Yesterday", score: 85, icon: MessageSquare, color: "text-cyan-500", bg: "bg-cyan-500/10" },
              { title: "Behavioral Prep", date: "3 days ago", score: 78, icon: Mic, color: "text-purple-500", bg: "bg-purple-500/10" },
            ].map((session, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-white/5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${session.bg}`}>
                  <session.icon className={`w-5 h-5 ${session.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 dark:text-white truncate">{session.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{session.date}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white">{session.score}%</div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/history" className="mt-4 w-full py-3 flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
            View All History <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
