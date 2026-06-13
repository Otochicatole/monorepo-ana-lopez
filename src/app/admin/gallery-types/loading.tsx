import {
  FormCardSkeleton,
  ListCardSkeleton,
  LocaleTabsSkeleton,
  PageHeaderSkeleton,
} from "../_components/skeletons";

export default function AdminGalleryTypesLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <div className="mb-8 flex flex-col gap-6">
        <LocaleTabsSkeleton />
        <FormCardSkeleton />
      </div>
      <ListCardSkeleton rows={4} withThumbnail={false} />
    </div>
  );
}
