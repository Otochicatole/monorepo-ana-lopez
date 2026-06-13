import Link from "next/link";
import { Globe, Star, Zap } from "lucide-react";
import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import { listLocales } from "@/features/locale/infrastructure/locale-repository";
import {
  setDefaultLocaleAction,
  toggleLocaleActiveAction,
  upsertLocaleAction,
  deleteLocaleAction,
} from "@/features/admin/application/locale-actions";
import {
  PageHeader,
  Alert,
  Badge,
  EmptyState,
} from "@/features/admin/presentation/components/ui/page-shell";
import { Card, CardBody, CardHeader } from "@/features/admin/presentation/components/ui/card";
import { Button } from "@/features/admin/presentation/components/ui/button";
import { SubmitButton } from "@/features/admin/presentation/components/ui/submit-button";
import { ConfirmDeleteButton } from "@/features/admin/presentation/components/ui/confirm-delete-button";
import { FormField, Input } from "@/features/admin/presentation/components/ui/form-controls";

export default async function AdminLocalesPage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string; edit?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const locales = await listLocales();
  const editing = params?.edit
    ? locales.find((l) => l.id === params.edit)
    : undefined;

  return (
    <div>
      <PageHeader
        title="Locales"
        description="Languages available for translatable content."
        actions={
          editing ? (
            <Link href="/admin/locales">
              <Button variant="secondary">Cancel edit</Button>
            </Link>
          ) : null
        }
      />

      {params?.saved && <Alert tone="success">Locale saved successfully.</Alert>}
      {params?.error && (
        <Alert tone="error">{decodeURIComponent(params.error)}</Alert>
      )}

      {/* Create / Edit form */}
      <Card className="mb-8 mt-6">
        <CardHeader
          title={editing ? `Edit "${editing.name}"` : "Add locale"}
          description={
            editing
              ? "Change name, status or default. Code cannot be modified."
              : 'BCP 47 codes: "en", "es", "es-AR", "pt-BR".'
          }
        />
        <CardBody>
          <form action={upsertLocaleAction} className="flex max-w-md flex-col gap-4">
            {editing && <input type="hidden" name="id" value={editing.id} />}

            <FormField label="Language code" hint={editing ? "Cannot change after creation" : 'e.g. "es-AR"'}>
              {editing ? (
                <>
                  <input type="hidden" name="code" value={editing.code} />
                  <Input
                    defaultValue={editing.code}
                    readOnly
                    className="cursor-not-allowed font-mono opacity-60"
                  />
                </>
              ) : (
                <Input
                  name="code"
                  required
                  placeholder="es-AR"
                  autoComplete="off"
                  spellCheck={false}
                  className="font-mono"
                />
              )}
            </FormField>

            <FormField label="Display name">
              <Input
                name="name"
                required
                defaultValue={editing?.name}
                placeholder="Español (Argentina)"
              />
            </FormField>

            <div className="flex flex-col gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editing?.isActive ?? true}
                  className="h-4 w-4 accent-pk"
                />
                Active
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  name="isDefault"
                  defaultChecked={editing?.isDefault ?? false}
                  className="h-4 w-4 accent-pk"
                />
                Default
              </label>
            </div>

            <SubmitButton className="self-start">
              {editing ? "Update" : "Create locale"}
            </SubmitButton>
          </form>
        </CardBody>
      </Card>

      {/* Locale list */}
      {locales.length === 0 ? (
        <EmptyState
          title="No locales configured"
          description="Create at least one active locale before editing content."
        />
      ) : (
        <Card>
          <CardHeader title={`${locales.length} ${locales.length === 1 ? "locale" : "locales"}`} />
          <ul className="divide-y divide-white/10">
            {locales.map((locale) => {
              const isDeletable = locale.code !== "en" && !locale.isDefault;
              return (
                <li
                  key={locale.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
                >
                  {/* Icon + identity */}
                  <div className="flex items-center gap-3 sm:w-64 sm:shrink-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/60">
                      <Globe className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <span className="font-mono text-sm font-semibold text-white">{locale.code}</span>
                      <span className="mx-2 text-white/20">·</span>
                      <span className="text-sm text-white/70">{locale.name}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    <Badge tone={locale.isActive ? "success" : "neutral"}>
                      {locale.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {locale.isDefault && <Badge tone="warning">Default</Badge>}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/locales?edit=${locale.id}`}>
                      <Button variant="secondary" size="sm">Edit</Button>
                    </Link>

                    {!locale.isDefault && (
                      <form action={setDefaultLocaleAction}>
                        <input type="hidden" name="id" value={locale.id} />
                        <SubmitButton variant="ghost" size="sm">
                          <Star className="h-3.5 w-3.5" />
                          Set default
                        </SubmitButton>
                      </form>
                    )}

                    {!locale.isDefault && (
                      <form action={toggleLocaleActiveAction}>
                        <input type="hidden" name="id" value={locale.id} />
                        <input type="hidden" name="isActive" value={locale.isActive ? "false" : "true"} />
                        <SubmitButton variant="ghost" size="sm">
                          <Zap className="h-3.5 w-3.5" />
                          {locale.isActive ? "Deactivate" : "Activate"}
                        </SubmitButton>
                      </form>
                    )}

                    {isDeletable ? (
                      <ConfirmDeleteButton
                        action={deleteLocaleAction}
                        id={locale.id}
                        itemName={locale.name}
                        title="Delete locale?"
                        description={`Delete "${locale.name}" (${locale.code})? All content for this locale will be orphaned.`}
                        confirmLabel="Delete locale"
                        buttonLabel="Delete"
                      />
                    ) : (
                      <span className="text-xs text-white/25">
                        {locale.code === "en" ? "Base locale" : "Default — change first"}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
