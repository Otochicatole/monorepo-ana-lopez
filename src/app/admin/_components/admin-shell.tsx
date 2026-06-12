import Link from "next/link";
import { ReactNode } from "react";
import { getCurrentAdmin } from "@/features/admin/infrastructure/admin-auth";
import { AdminSidebar } from "@/features/admin/presentation/components/layout/admin-sidebar";
import { NavProgress } from "./nav-progress";

export default async function AdminShell({ children }: { children: ReactNode }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return <main className="min-h-screen bg-neutral-950 text-white">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Global navigation progress bar */}
      <NavProgress />

      <AdminSidebar />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/90 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-4 pl-16 lg:px-8 lg:pl-8">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-white/40">Administration</p>
              <p className="text-sm text-white/70">
                Signed in as <span className="font-medium text-white">{admin.username}</span>
              </p>
            </div>
            <Link
              href="/"
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/70 transition-colors hover:border-pk/40 hover:text-white"
            >
              View site ↗
            </Link>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
