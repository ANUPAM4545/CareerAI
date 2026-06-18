import Link from "next/link";
import { MessageSquare, Mic, ArrowRight } from "lucide-react";

export default function PracticeHub() {
  return (
    <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Practice Arena</h1>
        <p className="text-muted-foreground">Select a module to begin your training session.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Mock Interview */}
        <Link 
          href="/practice/interview"
          className="group relative flex flex-col justify-between p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Mock Technical Interview</h3>
            <p className="text-muted-foreground text-sm mb-8">
              A rigorous, back-and-forth technical and behavioral interview with a senior AI hiring manager.
            </p>
          </div>
          <div className="relative z-10 flex items-center text-sm font-medium text-primary">
            Initialize Session <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* English Coach */}
        <Link 
          href="/practice/english_coach"
          className="group relative flex flex-col justify-between p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Professional English Coach</h3>
            <p className="text-muted-foreground text-sm mb-8">
              Practice everyday workplace communication. The AI will subtly correct your grammar, phrasing, and vocabulary.
            </p>
          </div>
          <div className="relative z-10 flex items-center text-sm font-medium text-primary">
            Initialize Session <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
