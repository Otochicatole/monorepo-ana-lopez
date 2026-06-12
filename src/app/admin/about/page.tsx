import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import { upsertAboutAction } from "@/features/admin/application/admin-actions";
import { prisma } from "@/shared/infrastructure/prisma";
import { Field, MediaSelect } from "../_components/form-fields";
import { LocaleToggle, resolveAdminLocale } from "../_components/locale-toggle";
import { PageHeader } from "@/features/admin/presentation/components/ui/page-shell";
import { Card, CardBody } from "@/features/admin/presentation/components/ui/card";
import { Button } from "@/features/admin/presentation/components/ui/button";
import { Textarea } from "@/features/admin/presentation/components/ui/form-controls";

export default async function AdminAboutPage({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const locale = await resolveAdminLocale(params?.locale);
  const [record, media] = await Promise.all([
    prisma.aboutContent.findUnique({ where: { localeId: locale.id } }),
    prisma.mediaFile.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="About Content"
        description="Edit the three text and image blocks shown on the about page."
      />
      <LocaleToggle current={locale} basePath="/admin/about" />
      <form action={upsertAboutAction} className="space-y-5">
        <input type="hidden" name="localeId" value={locale.id} />
        {[1, 2, 3].map((index) => (
          <Card key={index}>
            <CardBody className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
                Block {index}
              </h2>
              <Field label={`Text ${index}`}>
                <Textarea
                  name={`text${index}`}
                  rows={5}
                  defaultValue={
                    index === 1
                      ? record?.text1 || ""
                      : index === 2
                        ? record?.text2 || ""
                        : record?.text3 || ""
                  }
                />
              </Field>
              <Field label={`Image ${index}`}>
                <MediaSelect
                  name={`image${index}Id`}
                  media={media}
                  defaultValue={
                    index === 1
                      ? record?.image1Id
                      : index === 2
                        ? record?.image2Id
                        : record?.image3Id
                  }
                />
              </Field>
            </CardBody>
          </Card>
        ))}
        <Button type="submit">Save about content</Button>
      </form>
    </div>
  );
}
