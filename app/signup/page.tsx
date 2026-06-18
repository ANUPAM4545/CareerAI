"use client";

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, Terminal, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { signup, signInWithGoogle } from '@/app/auth/actions';

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSignup = async (formData: FormData) => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
      }
      if (result?.success) {
        setSuccess(result.success);
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      
      {/* Left Side: Dark Mode Image Banner */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 items-center justify-center p-12 overflow-hidden border-r border-border">
        {/* The generated dark mode image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 pointer-events-none mix-blend-screen"
          style={{ backgroundImage: "url('/auth-bg.png')" }}
        />
        {/* Subtle gradient overlay to fade edges */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/50" />
        
        <div className="relative z-10 w-full max-w-lg h-full flex flex-col justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </Link>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12 text-white"
          >
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Terminal className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold text-2xl tracking-tight">CareerSpeak</span>
            </div>

            <blockquote className="space-y-6">
              <p className="text-3xl font-medium leading-[1.3] tracking-tight">
                "Build your communication skills locally, push to production confidently. Join the next generation of communicators."
              </p>
              <footer className="text-sm text-zinc-500 font-mono flex flex-col mt-6">
                <span className="text-zinc-300 font-medium">README.md</span>
                <span>/docs/getting-started</span>
              </footer>
            </blockquote>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 h-screen overflow-y-auto">
        <Link
          href="/"
          className="lg:hidden absolute left-6 top-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px] flex flex-col justify-center space-y-8"
        >
          <div className="flex flex-col space-y-2 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Initialize Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Generate a new user profile in the database
            </p>
          </div>
          
          <div className="grid gap-6">
            <form action={handleSignup}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    type="text"
                    required
                    className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all shadow-sm"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    required
                    className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all shadow-sm"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all shadow-sm"
                  />
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20 font-mono"
                  >
                    ERR: {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-emerald-500 bg-emerald-500/10 p-3 rounded-md border border-emerald-500/20 font-mono"
                  >
                    SUCCESS: {success}
                  </motion.div>
                )}

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={isPending}
                  className="inline-flex items-center justify-center rounded-md text-sm font-semibold transition-all bg-foreground text-background hover:opacity-90 h-11 px-4 py-2 mt-2 disabled:opacity-50 shadow-sm"
                >
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  $ sudo register
                </motion.button>
              </div>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase font-mono tracking-wider">
                <span className="bg-background px-2 text-muted-foreground">
                  Or Execute
                </span>
              </div>
            </div>
            
            <form action={signInWithGoogle}>
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-all border border-border bg-card hover:bg-muted text-foreground h-11 px-4 py-2 shadow-sm"
              >
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                OAuth provider: Google
              </motion.button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an instance?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground hover:underline underline-offset-4"
            >
              Authenticate here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
