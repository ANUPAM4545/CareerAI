"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Shield, Moon, Sun, Save, Terminal, Loader2, UploadCloud, Key } from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  
  const [fullName, setFullName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        const { data: profile } = await supabase
          .from("users")
          .select("full_name, target_role, experience_level, avatar_url")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          setFullName(profile.full_name || "");
          setTargetRole(profile.target_role || "Software Engineer");
          setExperienceLevel(profile.experience_level || "Mid-Level");
          setAvatarUrl(profile.avatar_url || "");
        }
      }
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setProfileMessage("");
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Check if user exists
      const { data: existingUser } = await supabase.from("users").select("id").eq("id", user.id).single();
      
      let error;
      if (existingUser) {
        const { error: updateError } = await supabase
          .from("users")
          .update({
            full_name: fullName,
            target_role: targetRole,
            experience_level: experienceLevel
          })
          .eq("id", user.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("users")
          .insert({
            id: user.id,
            full_name: fullName,
            target_role: targetRole,
            experience_level: experienceLevel
          });
        error = insertError;
      }
      
      if (error) {
        console.error("Save error:", error);
        setProfileMessage("Error saving profile. Please try again.");
      } else {
        setProfileMessage("Configuration compiled and saved successfully.");
        router.refresh();
      }
    }
    setIsSaving(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      setIsSaving(true);
      setProfileMessage("");

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existingUser } = await supabase.from("users").select("id").eq("id", user.id).single();
        
        if (existingUser) {
          await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', user.id);
        } else {
          await supabase.from('users').insert({ id: user.id, avatar_url: publicUrl, full_name: fullName });
        }
          
        setAvatarUrl(publicUrl);
        setProfileMessage("Avatar uploaded successfully.");
        router.refresh();
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar! Ensure you ran the avatars_migration.sql script.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) return;
    setIsUpdatingPassword(true);
    setPasswordMessage("");
    
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordMessage("Password updated successfully!");
      setNewPassword("");
    } catch (error: any) {
      setPasswordMessage(error.message || "Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Logs", icon: Terminal },
    { id: "security", label: "Security", icon: Shield },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Terminal className="w-6 h-6 text-muted-foreground" />
          System Config
        </h1>
        <p className="text-muted-foreground mt-1 text-sm font-mono">Manage runtime environment and deployment parameters.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap border ${
                  activeTab === tab.id
                    ? "bg-muted text-foreground border-border"
                    : "text-muted-foreground hover:bg-muted/50 border-transparent"
                }`}
              >
                <tab.icon className="w-4 h-4 opacity-80" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <motion.main 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 bg-card rounded-xl border border-border shadow-sm p-6 md:p-8"
        >
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground mb-6">User Parameters</h2>
              
              <div className="flex items-center gap-6 pb-6 border-b border-border">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border border-border" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center text-background text-2xl font-bold uppercase">
                    {fullName ? fullName.substring(0, 2) : "CS"}
                  </div>
                )}
                <div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleAvatarUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg text-sm font-medium transition-colors"
                  >
                    <UploadCloud className="w-4 h-4" />
                    Upload Avatar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-mono text-muted-foreground">config.full_name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-foreground/50 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-mono text-muted-foreground">config.email</label>
                  <input 
                    type="email" 
                    value={email}
                    disabled 
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/50 text-muted-foreground text-sm outline-none cursor-not-allowed" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-mono text-muted-foreground">deploy.target_role</label>
                  <input 
                    type="text" 
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-foreground/50 transition-all" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">Defines the specific role the AI will interview you for.</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-mono text-muted-foreground">deploy.experience_level</label>
                  <select 
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-foreground/50 transition-all appearance-none"
                  >
                    <option value="Intern">Intern</option>
                    <option value="Junior">Junior (0-2 YOE)</option>
                    <option value="Mid-Level">Mid-Level (3-5 YOE)</option>
                    <option value="Senior">Senior (5-8 YOE)</option>
                    <option value="Staff/Principal">Staff/Principal (8+ YOE)</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">Calibrates the difficulty of the AI's questions.</p>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-foreground hover:bg-foreground/90 text-background rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                  Compile & Save
                </button>
                {profileMessage && (
                  <p className="text-sm mt-3 font-mono text-emerald-500">
                    [OK] {profileMessage}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Log Preferences</h2>
              <p className="text-sm text-muted-foreground font-mono">[WARNING] Notifications module not yet deployed.</p>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Environment Config</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-mono text-muted-foreground mb-3">UI Theme</h3>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setTheme("light")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${theme === 'light' ? 'border-foreground text-foreground bg-muted' : 'border-border text-muted-foreground hover:border-foreground/30'}`}
                    >
                      <Sun className="w-4 h-4" /> Light
                    </button>
                    <button 
                      onClick={() => setTheme("dark")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${theme === 'dark' ? 'border-foreground text-foreground bg-muted' : 'border-border text-muted-foreground hover:border-foreground/30'}`}
                    >
                      <Moon className="w-4 h-4" /> Dark
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-sm font-mono text-muted-foreground mb-4">Auth Hash Update</h3>
                  <div className="space-y-4 max-w-md">
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password Hash" 
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-foreground/50 transition-all" 
                    />
                    <button 
                      onClick={handleUpdatePassword}
                      disabled={isUpdatingPassword || !newPassword}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                      Execute Update
                    </button>
                    {passwordMessage && (
                      <p className={`text-sm mt-2 font-mono ${passwordMessage.includes("success") ? "text-emerald-500" : "text-destructive"}`}>
                        [{passwordMessage.includes("success") ? "OK" : "ERR"}] {passwordMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.main>
      </div>
    </div>
  );
}
