'use client';
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useLocale } from "@/core/context/locale-context";
import { motion, AnimatePresence } from "framer-motion";
import { Settings } from "lucide-react";

export default function FloatingButtons() {
    const { locale, setLocale } = useLocale();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        };

        if (isLangOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isLangOpen]);

    const handleLocaleChange = (newLocale: 'en' | 'es-AR') => {
        setIsLangOpen(false);
        setLocale(newLocale);
    };

    return (
        <>
            {/* Desktop - Siempre visible */}
            <div className="hidden lg:flex fixed right-0 bg-white/5 backdrop-blur-lg rounded-l-md bottom-10 z-30 flex-col gap-4 items-center py-3">
                {/* Language Selector */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        className="flex items-center justify-center gap-1.5 w-14 h-14 cursor-pointer hover:scale-110 transition-transform hover:text-pk"
                        aria-label="Select language"
                    >
                        <span className="text-sm">{locale === 'en' ? 'EN' : 'ES'}</span>
                    </button>

                    {isLangOpen && (
                        <div className="absolute bottom-full right-0 mb-2 w-32 bg-nav rounded-md shadow-lg border border-white/10 overflow-hidden">
                            <button
                                onClick={() => handleLocaleChange('en')}
                                className={`w-full text-left px-4 py-2 font-bold transition-colors ${locale === 'en' ? 'text-pk bg-white/10' : 'text-white hover:bg-white/5'}`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => handleLocaleChange('es-AR')}
                                className={`w-full text-left px-4 py-2 font-bold transition-colors ${locale === 'es-AR' ? 'text-pk bg-white/10' : 'text-white hover:bg-white/5'}`}
                            >
                                Español
                            </button>
                        </div>
                    )}
                </div>

                <Link
                    href={process.env.NEXT_PUBLIC_TIKTOK_URL || '/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-14 h-14 hover:scale-110 transition-transform"
                    aria-label="TikTok"
                >
                    <Image src="/svgs/tiktok.svg" alt="TikTok" width={24} height={24} className="opacity-80 hover:opacity-100 transition-opacity" />
                </Link>

                <Link
                    href={process.env.NEXT_PUBLIC_WHATSAPP_URL || '/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-14 h-14 hover:scale-110 transition-transform"
                    aria-label="WhatsApp"
                >
                    <Image src="/svgs/wp.svg" alt="WhatsApp" width={24} height={24} className="opacity-80 hover:opacity-100 transition-opacity" />
                </Link>

                <Link
                    href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || '/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-14 h-14 hover:scale-110 transition-transform"
                    aria-label="Instagram"
                >
                    <Image src="/svgs/ig.svg" alt="Instagram" width={24} height={24} className="opacity-80 hover:opacity-100 transition-opacity" />
                </Link>
            </div>

            {/* Mobile - Con toggle */}
            <div className="lg:hidden fixed right-4 bottom-4 z-30">
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute bottom-16 -right-1 bg-white/10 backdrop-blur-lg rounded-lg p-2 flex flex-col gap-2 shadow-lg border border-white/10"
                        >
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 }}
                                className="relative"
                                ref={dropdownRef}
                            >
                                <button
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label="Select language"
                                >
                                    <span className="text-xs font-bold">{locale === 'en' ? 'EN' : 'ES'}</span>
                                </button>

                                {isLangOpen && (
                                    <div className="absolute bottom-full right-0 mb-2 w-28 bg-nav rounded-md shadow-lg border border-white/10 overflow-hidden">
                                        <button
                                            onClick={() => handleLocaleChange('en')}
                                            className={`w-full text-left px-3 py-2 text-sm font-bold transition-colors ${locale === 'en' ? 'text-pk bg-white/10' : 'text-white hover:bg-white/5'}`}
                                        >
                                            English
                                        </button>
                                        <button
                                            onClick={() => handleLocaleChange('es-AR')}
                                            className={`w-full text-left px-3 py-2 text-sm font-bold transition-colors ${locale === 'es-AR' ? 'text-pk bg-white/10' : 'text-white hover:bg-white/5'}`}
                                        >
                                            Español
                                        </button>
                                    </div>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Link
                                    href={process.env.NEXT_PUBLIC_TIKTOK_URL || '/'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label="TikTok"
                                >
                                    <Image src="/svgs/tiktok.svg" alt="TikTok" width={20} height={20} className="opacity-80" />
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                <Link
                                    href={process.env.NEXT_PUBLIC_WHATSAPP_URL || '/'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label="WhatsApp"
                                >
                                    <Image src="/svgs/wp.svg" alt="WhatsApp" width={20} height={20} className="opacity-80" />
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Link
                                    href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || '/'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label="Instagram"
                                >
                                    <Image src="/svgs/ig.svg" alt="Instagram" width={20} height={20} className="opacity-80" />
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-14 h-14 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center shadow-lg border border-white/10 hover:bg-white/20 transition-colors"
                    aria-label={isExpanded ? "Cerrar menú" : "Abrir menú"}
                    whileTap={{ scale: 0.9 }}
                >
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Settings size={20} />
                    </motion.div>
                </motion.button>
            </div>
        </>
    );
}