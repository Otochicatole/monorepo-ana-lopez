import { DashboardSkeleton, PageHeaderSkeleton } from "./_components/skeletons";

export default function AdminLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <DashboardSkeleton />
    </div>
  );
}
