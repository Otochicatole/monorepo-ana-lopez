import Link from "next/link";
import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import { prisma } from "@/shared/infrastructure/prisma";

const cards = [
  ["/admin/home", "Home Content"],
  ["/admin/about", "About Content"],
  ["/admin/media", "Media Library"],
  ["/admin/gallery-types", "Gallery Types"],
  ["/admin/gallery", "Gallery Items"],
  ["/admin/audit-logs", "Audit Logs"],
];

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [home, about, media, galleryTypes, galleryItems, auditLogs] = await Promise.all([
    prisma.homeContent.count({ where: { deletedAt: null } }),
    prisma.aboutContent.count({ where: { deletedAt: null } }),
    prisma.mediaFile.count({ where: { deletedAt: null } }),
    prisma.galleryType.count({ where: { deletedAt: null } }),
    prisma.galleryItem.count({ where: { deletedAt: null } }),
    prisma.auditLog.count(),
  ]);
  const counts = [home, about, media, galleryTypes, galleryItems, auditLogs];

  return (
    <div>
      <h1 className="oswald mb-8 text-4xl">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map(([href, label], index) => (
          <Link
            key={href}
            href={href}
            className="rounded border border-white/10 bg-white/5 p-5 hover:border-pk"
          >
            <p className="text-sm text-white/50">{label}</p>
            <p className="mt-3 text-4xl font-bold">{counts[index]}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
