"use client";

import Image from "next/image";
import {
  createMediaAction,
  deleteMediaAction,
} from "@/features/admin/application/admin-actions";
import { Field } from "../_components/form-fields";
import { PageHeader, EmptyState } from "@/features/admin/presentation/components/ui/page-shell";
import { Card, CardBody } from "@/features/admin/presentation/components/ui/card";
import { Button } from "@/features/admin/presentation/components/ui/button";
import { ConfirmDeleteButton } from "@/features/admin/presentation/components/ui/confirm-delete-button";
import { Input } from "@/features/admin/presentation/components/ui/form-controls";
import { MediaUploadButton } from "@/features/admin/presentation/components/media/media-upload-modal";

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

export function MediaLibraryClient({ media }: { media: MediaItem[] }) {
  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Global media assets reusable across all content. Document IDs are generated automatically on upload."
        actions={<MediaUploadButton />}
      />

      {media.length === 0 ? (
        <EmptyState
          title="No media files yet"
          description="Upload images to use them in home, about, and gallery content."
          action={<MediaUploadButton label="Upload first image" />}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {media.map((item) => (
            <Card key={item.id}>
              <CardBody className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-black/40">
                  {item.url.startsWith("/") && (
                    <Image
                      src={item.url}
                      alt={item.alternativeText || item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/40">Document ID</p>
                  <p className="font-mono text-xs text-white/70">{item.documentId}</p>
                </div>
                <form action={createMediaAction} className="space-y-3">
                  <input type="hidden" name="documentId" value={item.documentId} />
                  <Field label="Name">
                    <Input name="name" required defaultValue={item.name} />
                  </Field>
                  <Field label="URL">
                    <Input name="url" required defaultValue={item.url} />
                  </Field>
                  <Field label="Alt text">
                    <Input
                      name="alternativeText"
                      defaultValue={item.alternativeText || ""}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="MIME">
                      <Input name="mime" required defaultValue={item.mime} />
                    </Field>
                    <Field label="Extension">
                      <Input name="ext" defaultValue={item.ext || ""} />
                    </Field>
                    <Field label="Width">
                      <Input
                        name="width"
                        type="number"
                        defaultValue={item.width || ""}
                      />
                    </Field>
                    <Field label="Height">
                      <Input
                        name="height"
                        type="number"
                        defaultValue={item.height || ""}
                      />
                    </Field>
                  </div>
                  <input type="hidden" name="size" value={item.size} />
                  <Button type="submit" variant="secondary" size="sm">
                    Save changes
                  </Button>
                </form>
                <ConfirmDeleteButton
                  action={deleteMediaAction}
                  id={item.id}
                  itemName={item.name || item.documentId}
                  title="Delete media file?"
                  description={`Are you sure you want to delete "${item.name || item.documentId}"? Content using this file may break.`}
                />
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
