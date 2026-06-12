import Image from "next/image";
import { MediaFile } from "@prisma/client";

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
    <div className="grid gap-3 sm:grid-cols-2">
      {!required && (
        <label className="flex cursor-pointer items-center gap-3 rounded border border-white/10 bg-black/30 p-3">
          <input
            type="radio"
            name={name}
            value=""
            defaultChecked={!defaultValue}
          />
          <span>Sin imagen</span>
        </label>
      )}
      {media.map((item) => (
        <label
          key={item.id}
          className="grid cursor-pointer grid-cols-[80px_1fr] gap-3 rounded border border-white/10 bg-black/30 p-3 hover:border-pk"
        >
          <input
            type="radio"
            name={name}
            value={item.id}
            required={required}
            defaultChecked={defaultValue === item.id}
            className="sr-only"
          />
          <span className="relative block aspect-square overflow-hidden rounded bg-white/5">
            {item.url.startsWith("/") ? (
              <Image
                src={item.url}
                alt={item.alternativeText || item.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center px-2 text-center text-xs text-white/50">
                Sin preview
              </span>
            )}
          </span>
          <span className="min-w-0 self-center">
            <span className="block truncate font-bold text-white">{item.name}</span>
            <span className="block break-all text-xs text-white/50">{item.url}</span>
          </span>
        </label>
      ))}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-white/70">
      {label}
      {children}
    </label>
  );
}
