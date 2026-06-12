import Link from "next/link";
import { ReactNode } from "react";
import { getCurrentAdmin } from "@/features/admin/infrastructure/admin-auth";
import { logoutAction } from "@/features/admin/application/admin-actions";

const navItems = [
  ["/admin", "Dashboard"],
  ["/admin/home", "Home"],
  ["/admin/about", "About"],
  ["/admin/media", "Media"],
  ["/admin/gallery-types", "Gallery Types"],
  ["/admin/gallery", "Gallery"],
  ["/admin/audit-logs", "Audit Logs"],
];

export default async function AdminShell({ children }: { children: ReactNode }) {
  const admin = await getCurrentAdmin();

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-white/10 bg-black/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/admin" className="oswald text-2xl tracking-[4px]">
            CMS Ana Lopez
          </Link>
          {admin && (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {navItems.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded border border-white/10 px-3 py-2 text-white/80 hover:border-pk hover:text-pk"
                >
                  {label}
                </Link>
              ))}
              <form action={logoutAction}>
                <button className="rounded bg-white/10 px-3 py-2 text-white/80 hover:bg-white/20">
                  Logout
                </button>
              </form>
            </div>
          )}
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-6 py-8">{children}</section>
    </main>
  );
}
