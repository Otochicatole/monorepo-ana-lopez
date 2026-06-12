import Link from "next/link";
import {
  FileText,
  FolderOpen,
  Globe,
  Home,
  Images,
  ScrollText,
  Tags,
  ChevronRight,
} from "lucide-react";
import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import { prisma } from "@/shared/infrastructure/prisma";
import { PageHeader } from "@/features/admin/presentation/components/ui/page-shell";
import { Card } from "@/features/admin/presentation/components/ui/card";

const sections = [
  {
    label: "Content",
    items: [
      { href: "/admin/home", label: "Home Content", description: "Hero text and featured image", icon: Home },
      { href: "/admin/about", label: "About Content", description: "Three text + image blocks", icon: FileText },
    ],
  },
  {
    label: "Media & Gallery",
    items: [
      { href: "/admin/media", label: "Media Library", description: "All uploaded images", icon: Images },
      { href: "/admin/gallery-types", label: "Gallery Types", description: "Categories with translations", icon: Tags },
      { href: "/admin/gallery", label: "Gallery Items", description: "Photos shared across locales", icon: FolderOpen },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/locales", label: "Locales", description: "Active site languages", icon: Globe },
      { href: "/admin/audit-logs", label: "Audit Logs", description: "Recent admin activity", icon: ScrollText },
    ],
  },
];

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [home, about, media, galleryTypes, galleryItems, locales, auditLogs] =
    await Promise.all([
      prisma.homeContent.count({ where: { deletedAt: null } }),
      prisma.aboutContent.count({ where: { deletedAt: null } }),
      prisma.mediaFile.count({ where: { deletedAt: null } }),
      prisma.galleryType.count({ where: { deletedAt: null } }),
      prisma.galleryItem.count({ where: { deletedAt: null } }),
      prisma.locale.count({ where: { isActive: true } }),
      prisma.auditLog.count(),
    ]);

  const counts: Record<string, number> = {
    "/admin/home": home,
    "/admin/about": about,
    "/admin/media": media,
    "/admin/gallery-types": galleryTypes,
    "/admin/gallery": galleryItems,
    "/admin/locales": locales,
    "/admin/audit-logs": auditLogs,
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of content, media, gallery assets, and system activity."
      />

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.label}>
            <div className="border-b border-white/10 px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                {section.label}
              </p>
            </div>
            <ul className="divide-y divide-white/10">
              {section.items.map(({ href, label, description, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-colors group-hover:bg-pk/10 group-hover:text-pk">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-white/45">{description}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-2xl font-bold text-white/80">
                        {counts[href] ?? 0}
                      </span>
                      <ChevronRight className="h-4 w-4 text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:text-white/50" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
