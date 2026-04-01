'use client';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import useWindowSize from "@/shared/hooks/window-size";
import HomeNav from "./home-nav";
import { useTranslations } from "@/core/i18n/use-translations";

type DropDownProps = {
    pathname: string;
    open: boolean;
    onClose: () => void;
    onClosed: () => void;
    navItems: Array<{ id: number; name: string; href: string }>;
}

function DropDown({ pathname, open, onClose, onClosed, navItems }: DropDownProps) {
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        let inRaf1: number | undefined;
        let inRaf2: number | undefined;
        let hideTimer: ReturnType<typeof setTimeout> | undefined;
        let outTimer: ReturnType<typeof setTimeout> | undefined;

        if (open) {
            // entry: schedule via double RAF (async)
            inRaf1 = requestAnimationFrame(() => {
                inRaf2 = requestAnimationFrame(() => {
                    setAnimateIn(true);
                });
            });
        } else {
            // exit: set animateIn -> false asynchronously to avoid sync setState in effect
            hideTimer = setTimeout(() => setAnimateIn(false), 0);
            outTimer = setTimeout(() => {
                onClosed();
            }, 300);
        }

        return () => {
            if (typeof inRaf1 !== 'undefined') cancelAnimationFrame(inRaf1);
            if (typeof inRaf2 !== 'undefined') cancelAnimationFrame(inRaf2);
            if (hideTimer) clearTimeout(hideTimer);
            if (outTimer) clearTimeout(outTimer);
        }
    }, [open, onClosed]);

    return (
        <div className="absolute flex top-21 right-0 mt-2 w-full px-2 lg:hidden z-40">
            <div className={`bg-nav w-full rounded-md p-3 pb-6 flex flex-col gap-2 shadow-lg transition-all duration-500 ease-out transform ${animateIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-100 scale-95'}`}>
                {navItems.map(item => (
                    <Link
                        key={item.id}
                        href={item.href}
                        onClick={onClose}
                        className={`block font-bold px-2 py-2 text-center rounded ${pathname === item.href ? 'text-pk' : ''}`}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default function Nav() {
    const pathname = usePathname();
    const isHome = pathname === '/';
    const [open, setOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const t = useTranslations();

    const navItems = [
        { id: 1, name: t.nav.home, href: "/" },
        { id: 2, name: t.nav.gallery, href: "/gallery" },
        { id: 3, name: t.nav.about, href: "/about" },
        { id: 4, name: t.nav.contact, href: "/contact" },
    ];

    const width = useWindowSize();
    const prevWidthRef = useRef<number | null>(null);

    useEffect(() => {
        if (isHome) return;

        // Ignore initial render: set previous width and exit.
        if (prevWidthRef.current === null) {
            prevWidthRef.current = width;
            return;
        }

        const prev = prevWidthRef.current;
        prevWidthRef.current = width;

        // Close menu only when crossing from <1024 to >=1024
        let rafId: number | undefined;
        if (prev < 1024 && width >= 1024) {
            rafId = requestAnimationFrame(() => {
                setOpen(false);
                setShowDropdown(false);
            });
        }

        return () => {
            if (typeof rafId !== 'undefined') cancelAnimationFrame(rafId);
        }
    }, [width, isHome, open, showDropdown]);

    if (isHome) {
        return <HomeNav />;
    }

    const toggleMenu = () => {
        if (!open) {
            setShowDropdown(true);
            setOpen(true);
        } else {
            setOpen(false);
        }
    }

    return (
        <>
            <nav
                className={`fixed top-0 flex z-50 w-full py-5 px-6 lg:px-10 items-center justify-between transition-[background-color,backdrop-filter] duration-300 ease-in-out ${open ? 'bg-nav' : 'bg-white/5 backdrop-blur-lg'}`}>
                <h1 className="oswald text-2xl tracking-[8px]">Ana Lopez</h1>
                <ul className="hidden lg:flex gap-6">
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <Link
                                href={item.href}
                                className={`font-bold px-4 border-l border-r border-transparent hover:border-pk ${pathname === item.href ? 'text-pk' : ''}`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="hidden lg:flex items-center gap-4 justify-end w-full max-w-50">
                    <Image src="/svgs/makeup.svg" alt="Makeup" width={30} height={30} />
                </div>

                { /* Mobile Toggle Button */}
                <button
                    onClick={toggleMenu}
                    aria-expanded={open}
                    aria-label={open ? t.aria.closeMenu : t.aria.openMenu}
                    className="lg:hidden p-2 rounded-md flex items-center justify-center cursor-pointer text-white"
                >
                    <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
                    <div className="flex flex-col justify-center items-center gap-1.5 w-6 h-6">
                        <span
                            className={`block bg-current h-0.5 w-6 rounded transition-transform duration-300 ease-in-out`}
                            style={{ transform: open ? 'translateY(6px) rotate(45deg)' : 'translateY(0) rotate(0)' }}
                        />
                        <span
                            className={`block bg-current h-0.5 w-6 rounded transition-opacity duration-200 ease-in-out`}
                            style={{ opacity: open ? 0 : 1 }}
                        />
                        <span
                            className={`block bg-current h-0.5 w-6 rounded transition-transform duration-300 ease-in-out`}
                            style={{ transform: open ? 'translateY(-10px) rotate(-45deg)' : 'translateY(0) rotate(0)' }}
                        />
                    </div>
                </button>
                {showDropdown && (
                    <DropDown
                        pathname={pathname}
                        open={open}
                        onClose={() => setOpen(false)}
                        onClosed={() => setShowDropdown(false)}
                        navItems={navItems}
                    />
                )}
            </nav>
        </>
    );
}