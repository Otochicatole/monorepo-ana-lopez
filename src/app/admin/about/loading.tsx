import {
  ContentFormSkeleton,
  LocaleTabsSkeleton,
  PageHeaderSkeleton,
} from "../_components/skeletons";

export default function AdminAboutLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <LocaleTabsSkeleton />
      <ContentFormSkeleton blocks={3} />
    </div>
  );
}
