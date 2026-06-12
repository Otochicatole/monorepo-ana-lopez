import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import { upsertHomeAction } from "@/features/admin/application/admin-actions";
import { prisma } from "@/shared/infrastructure/prisma";
import { Field, MediaSelect } from "../_components/form-fields";
import { LocaleToggle, resolveAdminLocale } from "../_components/locale-toggle";
import { PageHeader } from "@/features/admin/presentation/components/ui/page-shell";
import { Card, CardBody } from "@/features/admin/presentation/components/ui/card";
import { Button } from "@/features/admin/presentation/components/ui/button";
import { Textarea } from "@/features/admin/presentation/components/ui/form-controls";

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const locale = await resolveAdminLocale(params?.locale);
  const [record, media] = await Promise.all([
    prisma.homeContent.findUnique({ where: { localeId: locale.id } }),
    prisma.mediaFile.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Home Content"
        description="Manage the hero about text and featured image for each locale."
      />
      <LocaleToggle current={locale} basePath="/admin/home" />
      <Card>
        <CardBody>
          <form action={upsertHomeAction} className="flex max-w-4xl flex-col gap-5">
            <input type="hidden" name="localeId" value={locale.id} />
            <Field label="About text">
              <Textarea
                name="about"
                required
                rows={8}
                defaultValue={record?.about || ""}
              />
            </Field>
            <Field label="About image">
              <MediaSelect
                name="imageAboutId"
                media={media}
                required
                defaultValue={record?.imageAboutId}
              />
            </Field>
            <div>
              <Button type="submit">Save home content</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
