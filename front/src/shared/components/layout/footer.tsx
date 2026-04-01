'use client';
import Link from "next/link";
import { useTranslations } from "@/core/i18n/use-translations";

export default function Footer() {
    const t = useTranslations();
    return (
        <footer className="flex flex-col px-6 py-8 md:px-12 md:py-12.5 bg-white/5 backdrop-blur-lg">
            <div className="flex flex-wrap md:flex-row gap-8 md:gap-10 lg:justify-between">
                <article className="flex flex-col w-full md:max-w-xl">
                    <h2 className="text-2xl font-bold mb-4">{t.footer.artOfMakeup}</h2>
                    <p className="mb-2">{t.footer.description}</p>
                </article>
                <article className="">
                    <h2 className="text-2xl font-bold mb-3">{t.footer.followUs}</h2>
                    <ul>
                        <li>
                            <Link href="https://www.tiktok.com/@ana.lopez.makeup" target="_blank" className="hover:text-pk hover:underline">TikTok</Link>
                        </li>
                        <li>
                            <Link href="https://www.facebook.com/ana.lopez.makeup" target="_blank" className="hover:text-pk hover:underline">Facebook</Link>
                        </li>
                        <li>
                            <Link href="https://www.instagram.com/ana.lopez.makeup/" target="_blank" className="hover:text-pk hover:underline">Instagram</Link>
                        </li>
                    </ul>
                </article>
                <article className="">
                    <h2 className="text-2xl font-bold mb-3">{t.footer.links}</h2>
                    <ul>
                        <li>
                            <Link href="/" className="hover:text-pk hover:underline">{t.nav.home}</Link>
                        </li>
                        <li>
                            <Link href="/gallery" className="hover:text-pk hover:underline">{t.nav.gallery}</Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-pk hover:underline">{t.nav.contact}</Link>
                        </li>
                    </ul>
                </article>
                <article className="xl:text-end">
                    <h2 className="text-2xl font-bold mb-3" >{t.footer.contact}</h2>
                    <ul>
                        <li>+549 3356-234-523</li>
                        <li>example@gmail.com</li>
                        <li>Instagram</li>
                    </ul>
                </article>
            </div>
            <div className="mt-12 md:mt-20 text-sm text-white/60">
                <p>&copy; {new Date().getFullYear()} Ana Lopez. {t.footer.allRightsReserved}</p>
            </div>
        </footer>
    );
}