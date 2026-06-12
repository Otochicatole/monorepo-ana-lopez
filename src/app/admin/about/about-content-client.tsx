"use client";

import { Globe } from "lucide-react";
import { upsertAboutAction } from "@/features/admin/application/admin-actions";
import {
  MediaPickerField,
  type MediaPickerItem,
} from "@/features/admin/presentation/components/media/media-picker-field";
import { PageHeader } from "@/features/admin/presentation/components/ui/page-shell";
import { Card, CardBody, CardHeader } from "@/features/admin/presentation/components/ui/card";
import { Button } from "@/features/admin/presentation/components/ui/button";
import { SubmitButton } from "@/features/admin/presentation/components/ui/submit-button";
import { Textarea } from "@/features/admin/presentation/components/ui/form-controls";
import type { LocaleEntity } from "@/features/locale/domain/locale";

type AboutRecord = {
  text1: string | null;
  image1Id: number | null;
  text2: string | null;
  image2Id: number | null;
  text3: string | null;
  image3Id: number | null;
} | null;

type AboutContentClientProps = {
  locale: LocaleEntity;
  locales: LocaleEntity[];
  record: AboutRecord;
  media: MediaPickerItem[];
};

const BLOCKS = [
  { index: 1, textField: "text1" as const, imageField: "image1Id" as const, label: "Opening block" },
  { index: 2, textField: "text2" as const, imageField: "image2Id" as const, label: "Middle block" },
  { index: 3, textField: "text3" as const, imageField: "image3Id" as const, label: "Closing block" },
];

export function AboutContentClient({
  locale,
  locales,
  record,
  media,
}: AboutContentClientProps) {
  return (
    <div>
      <PageHeader
        title="About Content"
        description="Three text + image blocks shown on the about page. Each is translated per locale."
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
                href={`/admin/about?locale=${encodeURIComponent(l.code)}`}
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

      <form key={locale.id} action={upsertAboutAction} className="space-y-6">
        <input type="hidden" name="localeId" value={locale.id} />

        {BLOCKS.map(({ index, textField, imageField, label }) => (
          <Card key={index}>
            <CardHeader
              title={label}
              description={`Block ${index} of 3 — editing in ${locale.name}`}
            />
            <CardBody className="grid gap-6 lg:grid-cols-2">
              {/* Text */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/70">
                  Text
                </label>
                <Textarea
                  name={textField}
                  rows={7}
                  defaultValue={record?.[textField] ?? ""}
                  placeholder={`Write block ${index} text…`}
                />
              </div>

              {/* Image picker */}
              <MediaPickerField
                name={imageField}
                media={media}
                defaultValue={record?.[imageField]}
                label={`Image ${index}`}
                changeButtonLabel="Change image"
              />
            </CardBody>
          </Card>
        ))}

        {/* Save */}
        <div className="flex items-center gap-3">
          <SubmitButton>Save about content</SubmitButton>
          <div className="flex items-center gap-1.5 text-xs text-white/35">
            <Globe className="h-3.5 w-3.5" />
            Saving for: <span className="font-semibold text-white/55">{locale.name}</span>
          </div>
        </div>
      </form>
    </div>
  );
}
