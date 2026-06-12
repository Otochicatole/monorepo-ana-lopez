import Image from "next/image";
import { MediaFile } from "@prisma/client";
import { cn } from "@/features/admin/presentation/lib/cn";
import { FormField } from "@/features/admin/presentation/components/ui/form-controls";

export function MediaSelect({
  name,
  media,
  defaultValue,
  required,
}: {
  name: string;
  media: MediaFile[];
  defaultValue?: number | null;
  required?: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {!required && (
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-neutral-900/50 p-3 hover:border-pk/40">
          <input
            type="radio"
            name={name}
            value=""
            defaultChecked={!defaultValue}
            className="accent-pk"
          />
          <span className="text-sm text-white/70">No image</span>
        </label>
      )}
      {media.map((item) => (
        <label
          key={item.id}
          className={cn(
            "grid cursor-pointer grid-cols-[72px_1fr] gap-3 rounded-lg border border-white/10 bg-neutral-900/50 p-3 transition-colors hover:border-pk/40",
            defaultValue === item.id && "border-pk/60 ring-1 ring-pk/30"
          )}
        >
          <input
            type="radio"
            name={name}
            value={item.id}
            required={required}
            defaultChecked={defaultValue === item.id}
            className="sr-only"
          />
          <span className="relative block aspect-square overflow-hidden rounded-md bg-white/5">
            {item.url.startsWith("/") ? (
              <Image
                src={item.url}
                alt={item.alternativeText || item.name}
                fill
                sizes="72px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center px-2 text-center text-[10px] text-white/50">
                No preview
              </span>
            )}
          </span>
          <span className="min-w-0 self-center">
            <span className="block truncate text-sm font-semibold text-white">{item.name}</span>
            <span className="block truncate text-xs text-white/45">{item.url}</span>
          </span>
        </label>
      ))}
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return <FormField label={label} hint={hint}>{children}</FormField>;
}
