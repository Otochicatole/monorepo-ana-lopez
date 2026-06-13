import {
  GalleryToolbarSkeleton,
  ListCardSkeleton,
  PageHeaderSkeleton,
} from "../_components/skeletons";

export default function AdminGalleryLoading() {
  return (
    <div>
      <PageHeaderSkeleton withAction />
      <GalleryToolbarSkeleton />
      <ListCardSkeleton rows={5} />
    </div>
  );
}
