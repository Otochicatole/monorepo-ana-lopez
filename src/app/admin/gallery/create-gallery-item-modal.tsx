"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { createGalleryItemModalAction } from "@/features/admin/application/admin-actions";
import { MediaPickerField, type MediaPickerItem } from "@/features/admin/presentation/components/media/media-picker-field";
import { AdminModal } from "@/features/admin/presentation/components/ui/modal";
import { Button } from "@/features/admin/presentation/components/ui/button";
import { FormPendingBridge, SubmitButton } from "@/features/admin/presentation/components/ui/submit-button";
import { Alert } from "@/features/admin/presentation/components/ui/page-shell";
import { Field } from "../_components/form-fields";
import { Input } from "@/features/admin/presentation/components/ui/form-controls";
import { CustomSelect } from "@/shared/components/common/custom-select";
import type { GalleryTypeOption } from "./gallery-items-client";

type CreateGalleryItemModalProps = {
  open: boolean;
  onClose: () => void;
  mediaItems: MediaPickerItem[];
  types: GalleryTypeOption[];
};

export function CreateGalleryItemModal({
  open,
  onClose,
  mediaItems,
  types,
}: CreateGalleryItemModalProps) {
  const wasPendingRef = useRef(false);
  const [submitPending, setSubmitPending] = useState(false);
  const [state, formAction, pending] = useActionState(createGalleryItemModalAction, null);
  const handlePendingChange = useCallback((pendingState: boolean) => {
    setSubmitPending(pendingState);
  }, []);

  useEffect(() => {
    if (wasPendingRef.current && !pending && state?.success) {
      onClose();
    }
    wasPendingRef.current = pending;
  }, [pending, state, onClose]);

  const isPending = pending || submitPending;

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Create gallery item"
      description="Document ID is generated automatically when the item is created."
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <SubmitButton form="create-gallery-item-form" pending={isPending}>
            Create item
          </SubmitButton>
        </>
      }
    >
      <form id="create-gallery-item-form" action={formAction} className="space-y-4">
        <FormPendingBridge onPendingChange={handlePendingChange} />
        {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
        <Field label="Internal name (optional)">
          <Input name="name" placeholder="Editorial cover" disabled={isPending} />
        </Field>
        <Field label="Gallery type">
          <CustomSelect
            name="galleryTypeId"
            placeholder="No type"
            disabled={isPending}
            options={[
              { value: "", label: "No type" },
              ...types.map((type) => ({
                value: String(type.id),
                label: type.documentId,
              })),
            ]}
          />
        </Field>
        <MediaPickerField name="mediaId" media={mediaItems} required refreshOnUpload={false} />
      </form>
    </AdminModal>
  );
}
