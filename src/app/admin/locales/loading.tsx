import {
  FormCardSkeleton,
  ListCardSkeleton,
  PageHeaderSkeleton,
} from "../_components/skeletons";

export default function AdminLocalesLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <div className="mb-8 mt-6">
        <FormCardSkeleton />
      </div>
      <ListCardSkeleton rows={4} withThumbnail={false} />
    </div>
  );
}
