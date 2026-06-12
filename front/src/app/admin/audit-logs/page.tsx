import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import { prisma } from "@/shared/infrastructure/prisma";

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
      <h1 className="oswald mb-8 text-4xl">Audit Logs</h1>
      <div className="overflow-x-auto rounded border border-white/10">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3">Fecha</th>
              <th className="p-3">Actor</th>
              <th className="p-3">Accion</th>
              <th className="p-3">Recurso</th>
              <th className="p-3">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const actor = log.actorId ? actorById.get(log.actorId) : null;
              return (
                <tr key={log.id} className="border-t border-white/10 align-top">
                  <td className="p-3 text-white/60">
                    {log.createdAt.toLocaleString("es-AR")}
                  </td>
                  <td className="p-3">
                    {actor ? `${actor.username} (${actor.email})` : log.actorId || "system"}
                  </td>
                  <td className="p-3">{log.action}</td>
                  <td className="p-3">
                    {log.resource}
                    {log.resourceId ? ` #${log.resourceId}` : ""}
                  </td>
                  <td className="p-3">
                    <pre className="max-w-md whitespace-pre-wrap rounded bg-black/40 p-2 text-xs text-white/70">
                      {formatMetadata(log.metadata)}
                    </pre>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
