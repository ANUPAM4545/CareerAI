"use client";

import { motion } from "framer-motion";
import { learningResources } from "@/lib/data/resources";
import { 
  BookOpen, 
  ExternalLink, 
  Video, 
  FileCode, 
  Headphones,
  LayoutTemplate,
  MessageSquare,
  Globe
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const getIconForType = (type: string) => {
  switch (type) {
    case "Video Series":
    case "Course":
    case "YouTube Channel":
      return <Video className="w-5 h-5" />;
    case "GitHub Repo":
    case "Cheat Sheet":
    case "Documentation":
      return <FileCode className="w-5 h-5" />;
    case "Podcast":
      return <Headphones className="w-5 h-5" />;
    case "Reddit":
    case "Discord Server":
    case "Community":
    case "X (Twitter)":
      return <MessageSquare className="w-5 h-5" />;
    case "Article Library":
    case "Newsletter / Video":
      return <Globe className="w-5 h-5" />;
    default:
      return <LayoutTemplate className="w-5 h-5" />;
  }
};

export default function ResourcesPage() {
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(learningResources.map(r => r.domain)))];

  const filteredResources = filter === "All" 
    ? learningResources 
    : learningResources.filter(r => r.domain === filter);

  return (
    <div className="flex-1 overflow-y-auto relative bg-background min-h-full">
      {/* Background Holographics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 dark:opacity-20" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full border border-primary/10 bg-primary/5 blur-[100px]"
        />
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-10 relative z-10">
        
        {/* Header */}
        <div className="mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono tracking-widest uppercase mb-4"
          >
            <BookOpen className="w-3 h-3" /> Knowledge Base Active
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-foreground uppercase drop-shadow-sm mb-4"
          >
            Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Resources</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-mono tracking-wide max-w-2xl text-sm"
          >
            ACCESS CURATED STUDY MATERIALS TO UPGRADE YOUR SKILLS BEFORE YOUR NEXT SIMULATION.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 text-xs font-mono uppercase tracking-widest rounded-lg border transition-all ${
                filter === cat 
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <motion.a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.3, type: "spring", stiffness: 200 }}
              className="group relative h-[250px] rounded-2xl overflow-hidden border border-border bg-card/50 backdrop-blur-md hover:border-primary/50 transition-all flex flex-col justify-between p-6 shadow-sm cursor-pointer"
            >
              {/* Scanning Line Animation */}
              <div className="absolute inset-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite]" />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center group-hover:scale-110 group-hover:border-primary/30 transition-transform text-foreground">
                    {getIconForType(resource.type)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-2 py-1 rounded bg-muted border border-border">
                      {resource.type}
                    </span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                
                <p className="text-sm text-muted-foreground font-mono leading-relaxed line-clamp-3">
                  {resource.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {resource.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </div>
  );
}
