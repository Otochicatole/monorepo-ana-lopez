import { cn } from "@/features/admin/presentation/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-white/10 bg-neutral-900/80 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-pk/60 focus:outline-none focus:ring-2 focus:ring-pk/20",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-white/10 bg-neutral-900/80 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-pk/60 focus:outline-none focus:ring-2 focus:ring-pk/20",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-pk/60 focus:outline-none focus:ring-2 focus:ring-pk/20",
        className
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("flex flex-col gap-2 text-sm font-medium text-white/70", className)}
      {...props}
    />
  );
}

export function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <Label>
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-normal text-white/40">{hint}</span> : null}
    </Label>
  );
}
