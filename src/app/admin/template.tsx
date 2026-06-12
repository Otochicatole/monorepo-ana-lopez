import { ReactNode } from "react";

// Next.js remounts this component on every navigation (unlike layout.tsx).
// That remount triggers the CSS animation, giving a smooth fade-in on every page change.
export default function AdminTemplate({ children }: { children: ReactNode }) {
  return <div className="admin-page-enter">{children}</div>;
}
