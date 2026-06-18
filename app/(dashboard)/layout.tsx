import { Sidebar } from "@/components/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="h-full relative dark:bg-slate-950 bg-slate-50">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80">
        <Sidebar />
      </div>
      <main className="md:pl-72 pb-10">
        {/* Mobile Nav would go here if needed, but keeping it simple for now */}
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
