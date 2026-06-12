"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FileText,
  FolderOpen,
  Globe,
  Home,
  Images,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  ScrollText,
  Tags,
  X,
} from "lucide-react";
import { cn } from "@/features/admin/presentation/lib/cn";
import { logoutAction } from "@/features/admin/application/admin-actions";

const navGroups = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/home", label: "Home", icon: Home },
      { href: "/admin/about", label: "About", icon: FileText },
    ],
  },
  {
    label: "Media & Gallery",
    items: [
      { href: "/admin/media", label: "Media Library", icon: Images },
      { href: "/admin/gallery-types", label: "Gallery Types", icon: Tags },
      { href: "/admin/gallery", label: "Gallery Items", icon: FolderOpen },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/locales", label: "Locales", icon: Globe },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
    ],
  },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  // Clear pending when navigation resolves
  useEffect(() => {
    setPending(null);
  }, [pathname]);

  function handleClick(href: string) {
    if (href === pathname) return;
    setPending(href);
    onNavigate?.();
  }

  return (
    <nav className="space-y-6">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
            {group.label}
          </p>
          <ul className="space-y-1">
            {group.items.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
              const isPending = pending === href;

              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => handleClick(href)}
                    onMouseEnter={() => router.prefetch(href)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active || isPending
                        ? "bg-pk/15 text-pk"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                    ) : (
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    )}
                    <span className="flex-1">{label}</span>
                    {isPending && (
                      <span className="h-1.5 w-1.5 rounded-full bg-pk animate-pulse" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const prevRef = useRef(pathname);

  // Close mobile sidebar on navigation
  useEffect(() => {
    if (prevRef.current !== pathname) {
      prevRef.current = pathname;
      setOpen(false);
    }
  }, [pathname]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-neutral-950 text-white transition-colors hover:bg-white/5 lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-neutral-950 transition-transform duration-300 ease-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <Link href="/admin" className="oswald text-xl tracking-[0.18em] text-white">
            CMS Ana Lopez
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-white/60 hover:bg-white/5 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <NavLinks />
        </div>

        {/* Logout */}
        <div className="border-t border-white/10 p-4">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
