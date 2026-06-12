'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from '@/core/i18n/use-translations';

export default function HomeNav() {
    const [open, setOpen] = useState(false);
    const [showPanel, setShowPanel] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const t = useTranslations();

    const navItems = [
        { id: 1, name: t.nav.home, href: '/' },
        { id: 2, name: t.nav.gallery, href: '/gallery' },
        { id: 3, name: t.nav.about, href: '/about' },
        { id: 4, name: t.nav.contact, href: '/contact' },
    ];

    const raf1 = useRef<number | undefined>(undefined);
    const raf2 = useRef<number | undefined>(undefined);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const openMenu = () => {
        setShowPanel(true);
        raf1.current = requestAnimationFrame(() => {
            raf2.current = requestAnimationFrame(() => {
                setAnimateIn(true);
                setOpen(true);
            });
        });
    };

    const closeMenu = () => {
        setAnimateIn(false);
        setOpen(false);
        closeTimer.current = setTimeout(() => setShowPanel(false), 300);
    };

    useEffect(() => {
        return () => {
            if (raf1.current) cancelAnimationFrame(raf1.current);
            if (raf2.current) cancelAnimationFrame(raf2.current);
            if (closeTimer.current) clearTimeout(closeTimer.current);
        };
    }, []);

    useEffect(() => {
        if (showPanel) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showPanel]);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-5 bg-transparent">
                <div />
                <button
                    aria-label={open ? t.aria.closeMenu : t.aria.openMenu}
                    onClick={() => (open ? closeMenu() : openMenu())}
                    className="p-2 rounded-md flex items-center justify-center cursor-pointer text-white"
                >
                    <div className="flex flex-col justify-center items-center gap-1.5 w-6 h-6">
                        <span
                            className="block bg-current h-0.5 w-6 rounded transition-transform duration-300"
                            style={{ transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }}
                        />
                        <span
                            className="block bg-current h-0.5 w-6 rounded transition-opacity duration-200"
                            style={{ opacity: open ? 0 : 1 }}
                        />
                        <span
                            className="block bg-current h-0.5 w-6 rounded transition-transform duration-300"
                            style={{ transform: open ? 'translateY(-10px) rotate(-45deg)' : 'none' }}
                        />
                    </div>
                </button>
            </nav>

            {showPanel && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-8">
                    <div
                        className={`absolute inset-0 bg-nav transition-opacity duration-300 ${animateIn ? 'opacity-95' : 'opacity-0'}`}
                        onClick={closeMenu}
                    />

                    <div
                        role="dialog"
                        aria-modal="true"
                        className={`relative z-10 transform transition-all duration-300 ${animateIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-95'}`}
                    >
                        <ul className="flex flex-col items-center gap-8">
                            {navItems.map((item) => (
                                <li key={item.id}>
                                    <Link href={item.href} onClick={closeMenu} className={`transition-all ${item.href === '/' ? 'text-pk' : 'hover:text-pk/80'} text-4xl font-bold`}>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}
