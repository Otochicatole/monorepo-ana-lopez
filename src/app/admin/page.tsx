import Link from "next/link";
import {
  FileText,
  FolderOpen,
  Globe,
  Home,
  Images,
  ScrollText,
  Tags,
} from "lucide-react";
import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import { prisma } from "@/shared/infrastructure/prisma";
import { PageHeader } from "@/features/admin/presentation/components/ui/page-shell";
import { Card, CardBody } from "@/features/admin/presentation/components/ui/card";

const cards = [
  { href: "/admin/home", label: "Home Content", icon: Home },
  { href: "/admin/about", label: "About Content", icon: FileText },
  { href: "/admin/media", label: "Media Library", icon: Images },
  { href: "/admin/gallery-types", label: "Gallery Types", icon: Tags },
  { href: "/admin/gallery", label: "Gallery Items", icon: FolderOpen },
  { href: "/admin/locales", label: "Locales", icon: Globe },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
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
  const counts = [home, about, media, galleryTypes, galleryItems, locales, auditLogs];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of content, media, gallery assets, and system activity."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ href, label, icon: Icon }, index) => (
          <Link key={href} href={href}>
            <Card className="h-full transition-colors hover:border-pk/40">
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-white/50">{label}</p>
                    <p className="mt-3 text-4xl font-bold text-white">{counts[index]}</p>
                  </div>
                  <span className="rounded-lg bg-white/5 p-2 text-pk">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
