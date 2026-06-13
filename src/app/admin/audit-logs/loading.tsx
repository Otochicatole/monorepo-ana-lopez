import { PageHeaderSkeleton, TableCardSkeleton } from "../_components/skeletons";

export default function AdminAuditLogsLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <TableCardSkeleton rows={8} />
    </div>
  );
}
