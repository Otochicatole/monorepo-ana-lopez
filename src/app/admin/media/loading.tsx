import { ListCardSkeleton, PageHeaderSkeleton } from "../_components/skeletons";

export default function AdminMediaLoading() {
  return (
    <div>
      <PageHeaderSkeleton withAction />
      <ListCardSkeleton rows={6} />
    </div>
  );
}
