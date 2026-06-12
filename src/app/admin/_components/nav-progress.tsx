"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function NavProgress() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [width, setWidth] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Listen to link clicks to START the bar
  useEffect(() => {
    function startProgress() {
      if (tickRef.current) clearInterval(tickRef.current);
      if (doneRef.current) clearTimeout(doneRef.current);

      setState("loading");
      setWidth(0);

      let w = 0;
      tickRef.current = setInterval(() => {
        // Fast to 35%, slow crawl to 82%
        const increment = w < 35 ? 4 : w < 60 ? 1.5 : w < 82 ? 0.4 : 0;
        w = Math.min(w + increment, 82);
        setWidth(w);
        if (w >= 82 && tickRef.current) clearInterval(tickRef.current);
      }, 40);
    }

    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      // Skip external, hash, same page
      if (
        href.startsWith("http") ||
        href.startsWith("//") ||
        href.startsWith("#") ||
        href === pathname ||
        href === ""
      ) return;

      // Skip if modifier key held (open in new tab etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      startProgress();
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  // FINISH the bar when pathname changes (navigation resolved)
  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    if (tickRef.current) clearInterval(tickRef.current);
    setState("done");
    setWidth(100);

    doneRef.current = setTimeout(() => {
      setState("idle");
      setWidth(0);
    }, 380);
  }, [pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (doneRef.current) clearTimeout(doneRef.current);
    };
  }, []);

  if (state === "idle") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-[2px] bg-pk"
      style={{
        width: `${width}%`,
        transition: state === "done" ? "width 0.2s ease-out, opacity 0.3s ease 0.25s" : "width 0.08s linear",
        opacity: state === "done" ? 0 : 1,
      }}
    />
  );
}
