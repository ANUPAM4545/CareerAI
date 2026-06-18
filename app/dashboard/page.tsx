"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Clock, 
  MessageSquare, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

const performanceData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 68 },
  { name: 'Wed', score: 74 },
  { name: 'Thu', score: 72 },
  { name: 'Fri', score: 81 },
  { name: 'Sat', score: 85 },
  { name: 'Sun', score: 88 },
];

const skillsData = [
  { name: 'Clarity', score: 85 },
  { name: 'Grammar', score: 70 },
  { name: 'Fluency', score: 90 },
  { name: 'Vocab', score: 65 },
  { name: 'Tech', score: 80 },
];

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Alex! 👋</h1>
          <p className="text-muted-foreground mt-1">Here is how your communication skills are progressing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/interview" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
            <Target className="w-4 h-4 mr-2" />
            New Interview
          </Link>
          <Link href="/dashboard/english" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            <MessageSquare className="w-4 h-4 mr-2" />
            Practice English
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Average Score</h3>
            <Trophy className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold">82/100</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-emerald-500 inline-flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +4.5%</span> from last week
          </p>
        </div>
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Practice Sessions</h3>
            <Target className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold">14</div>
          <p className="text-xs text-muted-foreground mt-1">
            3 sessions this week
          </p>
        </div>
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Practice Time</h3>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold">4.2 hrs</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total time spent practicing
          </p>
        </div>
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-primary">Current Streak</h3>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">5 Days 🔥</div>
          <p className="text-xs text-primary/80 mt-1">
            Keep it up to hit your goal!
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Line Chart */}
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <h3 className="font-semibold text-lg mb-6">Overall Progress</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--background))', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skills Radar/Bar Chart */}
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <h3 className="font-semibold text-lg mb-6">Skills Breakdown</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 500}} width={60} />
                <Tooltip 
                  cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Recent Sessions</h3>
          <Link href="/dashboard/history" className="text-sm text-primary hover:underline font-medium inline-flex items-center">
            View all <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="space-y-4">
          {[
            { role: 'Frontend Developer', type: 'Technical Interview', score: 88, date: 'Today, 10:30 AM', icon: Target },
            { role: 'General Meeting', type: 'Professional English', score: 75, date: 'Yesterday', icon: MessageSquare },
            { role: 'Product Manager', type: 'Behavioral Interview', score: 82, date: 'Mon, 14th', icon: Target },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <session.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm md:text-base">{session.role}</h4>
                  <p className="text-xs text-muted-foreground">{session.type} • {session.date}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="font-bold text-lg">{session.score}/100</div>
                <Link href="#" className="text-xs text-primary hover:underline">Review Details</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
