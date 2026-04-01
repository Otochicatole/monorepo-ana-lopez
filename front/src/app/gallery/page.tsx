'use client';
import Gallery from "@/features/gallery/components/ui/gallery";
import { useTranslations } from "@/core/i18n/use-translations";

export default function GalleryPage() {
    const t = useTranslations();
    
    return (
        <main className="flex flex-col items-center min-h-screen pt-20 px-3">
            <h1 className="oswald text-4xl lg:text-6xl mb-20 mt-10">{t.pages.gallery}</h1>
            <Gallery />
        </main>
    );
}
