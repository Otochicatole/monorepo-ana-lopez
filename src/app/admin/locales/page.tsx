import Link from "next/link";
import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import { listLocales } from "@/features/locale/infrastructure/locale-repository";
import {
  setDefaultLocaleAction,
  toggleLocaleActiveAction,
  upsertLocaleAction,
} from "@/features/admin/application/locale-actions";
import { PageHeader, Alert, Badge, EmptyState } from "@/features/admin/presentation/components/ui/page-shell";
import { Card, CardBody, CardHeader } from "@/features/admin/presentation/components/ui/card";
import { Button } from "@/features/admin/presentation/components/ui/button";
import { FormField, Input } from "@/features/admin/presentation/components/ui/form-controls";

export default async function AdminLocalesPage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string; edit?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const locales = await listLocales();
  const editing = params?.edit
    ? locales.find((locale) => locale.id === params.edit)
    : undefined;

  return (
    <div>
      <PageHeader
        title="Locales"
        description="Manage available languages for translatable content. Active locales appear in content editors and the public site."
        actions={
          editing ? (
            <Link href="/admin/locales">
              <Button variant="secondary">Cancel edit</Button>
            </Link>
          ) : null
        }
      />

      {params?.saved ? (
        <Alert tone="success" >
          Locale saved successfully.
        </Alert>
      ) : null}

      <Card className="mb-8 mt-6">
        <CardHeader
          title={editing ? "Edit locale" : "Create locale"}
          description='Use BCP 47-style codes such as "en" or "es-AR".'
        />
        <CardBody>
          <form action={upsertLocaleAction} className="grid gap-4 md:grid-cols-2">
            {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
            <FormField label="Code">
              <Input
                name="code"
                required
                defaultValue={editing?.code}
                placeholder="es-AR"
                readOnly={Boolean(editing)}
              />
            </FormField>
            <FormField label="Display name">
              <Input
                name="name"
                required
                defaultValue={editing?.name}
                placeholder="Español (Argentina)"
              />
            </FormField>
            <FormField label="Sort order">
              <Input
                name="sortOrder"
                type="number"
                min={0}
                defaultValue={editing?.sortOrder ?? 0}
              />
            </FormField>
            <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center">
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editing?.isActive ?? true}
                  className="accent-pk"
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  name="isDefault"
                  defaultChecked={editing?.isDefault ?? false}
                  className="accent-pk"
                />
                Default locale
              </label>
            </div>
            <div className="md:col-span-2">
              <Button type="submit">{editing ? "Update locale" : "Create locale"}</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {locales.length === 0 ? (
        <EmptyState
          title="No locales configured"
          description="Create at least one active locale before editing translatable content."
        />
      ) : (
        <Card>
          <CardHeader title="All locales" />
          <CardBody className="overflow-x-auto p-0">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.03] text-white/50">
                <tr>
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {locales.map((locale) => (
                  <tr key={locale.id} className="border-t border-white/10">
                    <td className="px-5 py-4 font-mono text-xs">{locale.code}</td>
                    <td className="px-5 py-4">{locale.name}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge tone={locale.isActive ? "success" : "neutral"}>
                          {locale.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {locale.isDefault ? <Badge tone="warning">Default</Badge> : null}
                      </div>
                    </td>
                    <td className="px-5 py-4">{locale.sortOrder}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/locales?edit=${locale.id}`}>
                          <Button variant="secondary" size="sm">
                            Edit
                          </Button>
                        </Link>
                        {!locale.isDefault ? (
                          <form action={setDefaultLocaleAction}>
                            <input type="hidden" name="id" value={locale.id} />
                            <Button type="submit" variant="ghost" size="sm">
                              Set default
                            </Button>
                          </form>
                        ) : null}
                        {!locale.isDefault ? (
                          <form action={toggleLocaleActiveAction}>
                            <input type="hidden" name="id" value={locale.id} />
                            <input
                              type="hidden"
                              name="isActive"
                              value={locale.isActive ? "false" : "true"}
                            />
                            <Button type="submit" variant="ghost" size="sm">
                              {locale.isActive ? "Deactivate" : "Activate"}
                            </Button>
                          </form>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
