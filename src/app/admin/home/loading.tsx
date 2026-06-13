import {
  ContentFormSkeleton,
  LocaleTabsSkeleton,
  PageHeaderSkeleton,
} from "../_components/skeletons";

export default function AdminHomeLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <LocaleTabsSkeleton />
      <ContentFormSkeleton blocks={2} />
    </div>
  );
}
