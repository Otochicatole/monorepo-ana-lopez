"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageIcon, Plus } from "lucide-react";
import { cn } from "@/features/admin/presentation/lib/cn";
import { Button } from "@/features/admin/presentation/components/ui/button";
import { FormField } from "@/features/admin/presentation/components/ui/form-controls";
import { AdminModalWide } from "@/features/admin/presentation/components/ui/modal";
import { MediaUploadModal } from "./media-upload-modal";

export type MediaPickerItem = {
  id: number;
  documentId: string;
  name: string;
  url: string;
  alternativeText: string | null;
};

type MediaPickerFieldProps = {
  name: string;
  media: MediaPickerItem[];
  defaultValue?: number | null;
  required?: boolean;
  label?: string;
  changeButtonLabel?: string;
};

export function MediaPickerField({
  name,
  media: initialMedia,
  defaultValue,
  required,
  label = "Media",
  changeButtonLabel = "Change image",
}: MediaPickerFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [media, setMedia] = useState(initialMedia);
  const [selectedId, setSelectedId] = useState<number | null>(defaultValue ?? null);

  useEffect(() => {
    setMedia(initialMedia);
  }, [initialMedia]);

  const selected = media.find((item) => item.id === selectedId) ?? null;

  function handleSelect(id: number) {
    setSelectedId(id);
    setPickerOpen(false);
  }

  function handleUploaded(item: MediaPickerItem) {
    setMedia((current) => {
      const exists = current.some((entry) => entry.id === item.id);
      return exists ? current : [item, ...current];
    });
    setSelectedId(item.id);
    setUploadOpen(false);
    setPickerOpen(false);
  }

  return (
    <FormField label={label}>
      <input type="hidden" name={name} value={selectedId ?? ""} required={required} />

      <div className="flex min-w-0 flex-col gap-4 overflow-hidden rounded-lg border border-white/10 bg-neutral-900/40 p-4 sm:flex-row sm:items-center">
        <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-black/40">
          {selected?.url.startsWith("/") ? (
            <Image
              src={selected.url}
              alt={selected.alternativeText || selected.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/30">
              <ImageIcon className="h-8 w-8" aria-hidden />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <p className="truncate text-sm font-medium text-white">
            {selected?.name ?? "No image selected"}
          </p>
          {selected ? (
            <>
              <p className="truncate font-mono text-xs text-white/45">{selected.documentId}</p>
              <p className="truncate text-xs text-white/45">{selected.url}</p>
            </>
          ) : (
            <p className="text-xs text-white/45">Pick or upload an image from the media library.</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setPickerOpen(true)}>
              {selected ? changeButtonLabel : "Select image"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setUploadOpen(true)}
            >
              <Plus className="h-4 w-4" aria-hidden />
              Upload new
            </Button>
          </div>
        </div>
      </div>

      <AdminModalWide
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Media library"
        description="Select an image, then save the form to apply changes."
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setUploadOpen(true)}>
              <Plus className="h-4 w-4" aria-hidden />
              Upload new image
            </Button>
            <Button type="button" variant="secondary" onClick={() => setPickerOpen(false)}>
              Close
            </Button>
          </>
        }
      >
        {media.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/50">
            No media yet. Upload a new image to get started.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {media.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={cn(
                    "grid grid-cols-[80px_1fr] gap-3 rounded-lg border p-3 text-left transition-colors hover:border-pk/50",
                    isSelected
                      ? "border-pk bg-pk/10 ring-1 ring-pk/30"
                      : "border-white/10 bg-neutral-900/50"
                  )}
                >
                  <span className="relative block aspect-square overflow-hidden rounded-md bg-white/5">
                    {item.url.startsWith("/") ? (
                      <Image
                        src={item.url}
                        alt={item.alternativeText || item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : null}
                  </span>
                  <span className="min-w-0 self-center">
                    <span className="block truncate text-sm font-semibold text-white">
                      {item.name}
                    </span>
                    <span className="block truncate font-mono text-[10px] text-white/40">
                      {item.documentId}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </AdminModalWide>

      <MediaUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={handleUploaded}
      />
    </FormField>
  );
}
