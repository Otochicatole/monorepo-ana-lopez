"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  uploadMediaFileAction,
  type UploadMediaState,
} from "@/features/admin/application/admin-actions";
import { AdminModal } from "@/features/admin/presentation/components/ui/modal";
import { Button } from "@/features/admin/presentation/components/ui/button";
import { SubmitButton } from "@/features/admin/presentation/components/ui/submit-button";
import { Alert } from "@/features/admin/presentation/components/ui/page-shell";
import { FormField, Input } from "@/features/admin/presentation/components/ui/form-controls";
import type { MediaPickerItem } from "./media-picker-field";

type MediaUploadModalProps = {
  open: boolean;
  onClose: () => void;
  onUploaded?: (media: MediaPickerItem) => void;
};

export function MediaUploadModal({ open, onClose, onUploaded }: MediaUploadModalProps) {
  const router = useRouter();
  const formId = useId();
  const wasPending = useRef(false);
  const [state, formAction, pending] = useActionState<UploadMediaState | null, FormData>(
    uploadMediaFileAction,
    null
  );

  useEffect(() => {
    if (wasPending.current && !pending && state?.media) {
      onUploaded?.(state.media);
      router.refresh();
      onClose();
    }
    wasPending.current = pending;
  }, [pending, state, onUploaded, onClose, router]);

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Upload image"
      description="Document ID is generated automatically. PNG, JPG or WEBP up to 5MB."
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <SubmitButton form={formId} pending={pending} pendingLabel="Uploading...">
            Upload image
          </SubmitButton>
        </>
      }
    >
      <form id={formId} action={formAction} className="space-y-4">
        {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
        <FormField label="Image file">
          <Input name="file" type="file" accept="image/*" required disabled={pending} />
        </FormField>
        <FormField label="Alt text (optional)">
          <Input
            name="alternativeText"
            placeholder="Describe the image"
            disabled={pending}
          />
        </FormField>
      </form>
    </AdminModal>
  );
}

export function MediaUploadButton({
  label = "Upload image",
  onUploaded,
}: {
  label?: string;
  onUploaded?: (media: MediaPickerItem) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <MediaUploadModal
        open={open}
        onClose={() => setOpen(false)}
        onUploaded={onUploaded}
      />
    </>
  );
}
