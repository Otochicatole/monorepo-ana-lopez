"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, ImageIcon } from "lucide-react";
import {
  createMediaAction,
  deleteMediaAction,
} from "@/features/admin/application/admin-actions";
import { Field } from "../_components/form-fields";
import { PageHeader, EmptyState } from "@/features/admin/presentation/components/ui/page-shell";
import { Card, CardHeader } from "@/features/admin/presentation/components/ui/card";
import { SubmitButton } from "@/features/admin/presentation/components/ui/submit-button";
import { ConfirmDeleteButton } from "@/features/admin/presentation/components/ui/confirm-delete-button";
import { Input } from "@/features/admin/presentation/components/ui/form-controls";
import { MediaUploadButton } from "@/features/admin/presentation/components/media/media-upload-modal";
import { cn } from "@/features/admin/presentation/lib/cn";

type MediaItem = {
  id: number;
  documentId: string;
  name: string;
  url: string;
  alternativeText: string | null;
  mime: string;
  ext: string | null;
  width: number | null;
  height: number | null;
  size: string;
};

function MediaRow({ item }: { item: MediaItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="flex flex-col divide-y divide-white/[0.06]">
      {/* Row summary */}
      <div className="flex items-center gap-4 px-5 py-3">
        {/* Thumbnail */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-black/40">
          {item.url.startsWith("/") ? (
            <Image
              src={item.url}
              alt={item.alternativeText || item.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/25">
              <ImageIcon className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{item.name}</p>
          <p className="truncate font-mono text-[11px] text-white/40">{item.documentId}</p>
          <p className="text-[11px] text-white/30">
            {item.mime} · {item.ext ?? "—"} · {item.size} kB
            {item.width && item.height ? ` · ${item.width}×${item.height}` : ""}
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-white/20 hover:text-white"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" /> Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" /> Edit
              </>
            )}
          </button>
          <ConfirmDeleteButton
            action={deleteMediaAction}
            id={item.id}
            itemName={item.name || item.documentId}
            title="Delete media file?"
            description={`Delete "${item.name || item.documentId}"? Content using this file may break.`}
          />
        </div>
      </div>

      {/* Expanded edit form */}
      {expanded && (
        <div className="bg-white/[0.02] px-5 py-4">
          <form action={createMediaAction} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <input type="hidden" name="documentId" value={item.documentId} />
            <input type="hidden" name="size" value={item.size} />
            <Field label="Name">
              <Input name="name" required defaultValue={item.name} />
            </Field>
            <Field label="URL">
              <Input name="url" required defaultValue={item.url} />
            </Field>
            <Field label="Alt text">
              <Input name="alternativeText" defaultValue={item.alternativeText || ""} />
            </Field>
            <Field label="MIME type">
              <Input name="mime" required defaultValue={item.mime} />
            </Field>
            <Field label="Extension">
              <Input name="ext" defaultValue={item.ext || ""} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Width">
                <Input name="width" type="number" defaultValue={item.width || ""} />
              </Field>
              <Field label="Height">
                <Input name="height" type="number" defaultValue={item.height || ""} />
              </Field>
            </div>
            <div className="flex items-end sm:col-span-2 lg:col-span-3">
              <SubmitButton variant="secondary" size="sm">Save changes</SubmitButton>
            </div>
          </form>
        </div>
      )}
    </li>
  );
}

export function MediaLibraryClient({ media }: { media: MediaItem[] }) {
  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Global media assets shared across all content."
        actions={<MediaUploadButton />}
      />

      {media.length === 0 ? (
        <EmptyState
          title="No media files yet"
          description="Upload images to use them in home, about, and gallery content."
          action={<MediaUploadButton label="Upload first image" />}
        />
      ) : (
        <Card>
          <CardHeader title={`${media.length} ${media.length === 1 ? "file" : "files"}`} />
          <ul className={cn("divide-y divide-white/10")}>
            {media.map((item) => (
              <MediaRow key={item.id} item={item} />
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
