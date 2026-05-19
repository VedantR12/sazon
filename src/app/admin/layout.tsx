import { redirect } from "next/navigation";
import { AdminSidebar } from "./components/admin-sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  return (
  <div className="flex h-screen bg-gray-100 overflow-hidden">

    <AdminSidebar />

    <main className="flex-1 overflow-auto">

  <div className="w-full max-w-[1600px] mx-auto">
    {children}
  </div>

</main>

  </div>
);
}