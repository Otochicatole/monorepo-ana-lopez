import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import { prisma } from "@/shared/infrastructure/prisma";
import { PageHeader } from "@/features/admin/presentation/components/ui/page-shell";
import { Card, CardBody, CardHeader } from "@/features/admin/presentation/components/ui/card";

function formatMetadata(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") return "{}";
  return JSON.stringify(metadata, null, 2);
}

export default async function AdminAuditLogsPage() {
  await requireAdmin();

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const actorIds = Array.from(
    new Set(logs.map((log) => log.actorId).filter(Boolean))
  ) as string[];
  const actors = actorIds.length
    ? await prisma.adminUser.findMany({
        where: { id: { in: actorIds } },
        select: { id: true, email: true, username: true },
      })
    : [];
  const actorById = new Map(actors.map((actor) => [actor.id, actor]));

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Latest 100 administrative actions recorded in the CMS."
      />
      <Card>
        <CardHeader title="Recent activity" />
        <CardBody className="overflow-x-auto p-0">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-white/50">
              <tr>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Actor</th>
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Resource</th>
                <th className="px-5 py-3 font-medium">Metadata</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const actor = log.actorId ? actorById.get(log.actorId) : null;
                return (
                  <tr key={log.id} className="border-t border-white/10 align-top">
                    <td className="px-5 py-4 text-white/60">
                      {log.createdAt.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      {actor ? `${actor.username} (${actor.email})` : log.actorId || "system"}
                    </td>
                    <td className="px-5 py-4">{log.action}</td>
                    <td className="px-5 py-4">
                      {log.resource}
                      {log.resourceId ? ` #${log.resourceId}` : ""}
                    </td>
                    <td className="px-5 py-4">
                      <pre className="max-w-md whitespace-pre-wrap rounded-lg bg-neutral-900/80 p-3 text-xs text-white/70">
                        {formatMetadata(log.metadata)}
                      </pre>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
