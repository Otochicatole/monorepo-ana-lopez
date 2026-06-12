"use client";

import { Globe } from "lucide-react";
import { upsertHomeAction } from "@/features/admin/application/admin-actions";
import {
  MediaPickerField,
  type MediaPickerItem,
} from "@/features/admin/presentation/components/media/media-picker-field";
import { PageHeader } from "@/features/admin/presentation/components/ui/page-shell";
import { Card, CardBody, CardHeader } from "@/features/admin/presentation/components/ui/card";
import { Button } from "@/features/admin/presentation/components/ui/button";
import { Textarea } from "@/features/admin/presentation/components/ui/form-controls";
import type { LocaleEntity } from "@/features/locale/domain/locale";

type HomeRecord = {
  about: string;
  imageAboutId: number | null;
} | null;

type HomeContentClientProps = {
  locale: LocaleEntity;
  locales: LocaleEntity[];
  record: HomeRecord;
  media: MediaPickerItem[];
};

export function HomeContentClient({
  locale,
  locales,
  record,
  media,
}: HomeContentClientProps) {
  return (
    <div>
      <PageHeader
        title="Home Content"
        description="Manage the hero text and featured image for each locale."
      />

      {/* Locale tabs */}
      {locales.length > 1 && (
        <div className="mb-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-white/40">
            Editing locale
          </p>
          <div
            className="inline-flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1"
            role="tablist"
          >
            {locales.map((l) => (
              <a
                key={l.id}
                href={`/admin/home?locale=${encodeURIComponent(l.code)}`}
                role="tab"
                aria-selected={l.id === locale.id}
                className={
                  l.id === locale.id
                    ? "rounded-lg bg-pk px-4 py-2 text-sm font-semibold text-neutral-950"
                    : "rounded-lg px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white"
                }
              >
                {l.name}
              </a>
            ))}
          </div>
        </div>
      )}

      <form key={locale.id} action={upsertHomeAction} className="space-y-6">
        <input type="hidden" name="localeId" value={locale.id} />

        {/* Hero content */}
        <Card>
          <CardHeader
            title="Hero section"
            description={`Content shown in the hero area — currently editing: ${locale.name}`}
          />
          <CardBody className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/70">About text</label>
              <Textarea
                name="about"
                required
                rows={8}
                defaultValue={record?.about ?? ""}
                placeholder="Write a short introduction…"
              />
            </div>
          </CardBody>
        </Card>

        {/* Image picker */}
        <Card>
          <CardHeader
            title="Hero image"
            description="Main image displayed alongside the about text."
          />
          <CardBody>
            <MediaPickerField
              name="imageAboutId"
              media={media}
              defaultValue={record?.imageAboutId}
              required
              label="Hero image"
            />
          </CardBody>
        </Card>

        {/* Save */}
        <div className="flex items-center gap-3">
          <Button type="submit">Save home content</Button>
          <div className="flex items-center gap-1.5 text-xs text-white/35">
            <Globe className="h-3.5 w-3.5" />
            Saving for: <span className="font-semibold text-white/55">{locale.name}</span>
          </div>
        </div>
      </form>
    </div>
  );
}
