import { DashboardLayoutClient } from "@/components/dashboard-layout-client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const userProfile = {
    fullName: profile?.full_name || "",
    avatarUrl: profile?.avatar_url || ""
  };

  return (
    <DashboardLayoutClient userProfile={userProfile}>
      {children}
    </DashboardLayoutClient>
  );
};

export default DashboardLayout;
