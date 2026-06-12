"use client";

import { useCallback, useState } from "react";
import { createGalleryItemAction } from "@/features/admin/application/admin-actions";
import { MediaPickerField, type MediaPickerItem } from "@/features/admin/presentation/components/media/media-picker-field";
import { AdminModal } from "@/features/admin/presentation/components/ui/modal";
import { Button } from "@/features/admin/presentation/components/ui/button";
import { FormPendingBridge, SubmitButton } from "@/features/admin/presentation/components/ui/submit-button";
import { Field } from "../_components/form-fields";
import { Input } from "@/features/admin/presentation/components/ui/form-controls";
import { CustomSelect } from "@/shared/components/common/custom-select";
import type { GalleryTypeOption } from "./gallery-items-client";

type CreateGalleryItemModalProps = {
  open: boolean;
  onClose: () => void;
  mediaItems: MediaPickerItem[];
  types: GalleryTypeOption[];
  suggestedDocumentId: string;
};

export function CreateGalleryItemModal({
  open,
  onClose,
  mediaItems,
  types,
  suggestedDocumentId,
}: CreateGalleryItemModalProps) {
  const [submitPending, setSubmitPending] = useState(false);
  const handlePendingChange = useCallback((pending: boolean) => {
    setSubmitPending(pending);
  }, []);

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Create gallery item"
      description="Document ID is optional and will be generated automatically if left blank."
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitPending}>
            Cancel
          </Button>
          <SubmitButton form="create-gallery-item-form" pending={submitPending}>
            Create item
          </SubmitButton>
        </>
      }
    >
      <form
        id="create-gallery-item-form"
        action={createGalleryItemAction}
        onSubmit={onClose}
        className="space-y-4"
      >
        <FormPendingBridge onPendingChange={handlePendingChange} />
        <Field label="Document ID" hint="Leave blank to auto-generate">
          <Input name="documentId" placeholder={suggestedDocumentId} />
        </Field>
        <Field label="Internal name (optional)">
          <Input name="name" placeholder="Editorial cover" />
        </Field>
        <Field label="Gallery type">
          <CustomSelect
            name="galleryTypeId"
            placeholder="No type"
            options={[
              { value: "", label: "No type" },
              ...types.map((type) => ({
                value: String(type.id),
                label: type.documentId,
              })),
            ]}
          />
        </Field>
        <MediaPickerField name="mediaId" media={mediaItems} required />
      </form>
    </AdminModal>
  );
}
