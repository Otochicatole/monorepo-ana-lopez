"use client";

import { usePathname } from "next/navigation";
import Nav from "./nav";
import Footer from "./footer";
import FloatingButtons from "./floating";

function useIsAdminRoute() {
  const pathname = usePathname();
  return pathname.startsWith("/admin");
}

export function PublicNav() {
  if (useIsAdminRoute()) return null;
  return <Nav />;
}

export function PublicFooter() {
  if (useIsAdminRoute()) return null;
  return <Footer />;
}

export function PublicFloatingButtons() {
  if (useIsAdminRoute()) return null;
  return <FloatingButtons />;
}
