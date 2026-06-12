'use client';
import { httpGetGallery } from "@/core/http/http-get-gallery";
import { buildImageUrl } from "@/core/http/build-image-url";
import { GalleryResponse } from "@/core/types/http-gallery.types";
import FadeInObserver from "@/shared/components/common/fade-in-observer";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/core/context/locale-context";
import { useTranslations } from "@/core/i18n/use-translations";

export default function Works() {
    const [galleryData, setGalleryData] = useState<GalleryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { locale } = useLocale();
    const t = useTranslations();

    useEffect(() => {
        const fetchLatestGallery = async () => {
            try {
                const data = await httpGetGallery(1, 6, undefined, locale);
                setGalleryData(data);
                console.log("Latest gallery data fetched:", data);
            } catch (error) {
                console.error("Error fetching latest gallery:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestGallery();
    }, [locale]);

    return (
        <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl oswald py-10 sm:py-12 md:py-16 lg:py-20 text-center">{t.home.latestWorks}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 pb-10">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <article
                            key={`skeleton-${index}`}
                            className="flex w-full h-full max-w-137.5 max-h-187.5 items-center rounded-md justify-center"
                        >
                            <div className="w-full h-full min-h-60 sm:min-h-80 md:min-h-96 lg:min-h-187.5 bg-white/20 animate-pulse rounded-md" />
                        </article>
                    ))
                ) : (
                    galleryData?.data?.map((item, index) => (
                        <FadeInObserver key={item.id} delay={index * 0.15}>
                            <article className="flex w-full h-full max-w-137.5 max-h-187.5 items-center rounded-md justify-center">
                                {item.media && (
                                    <Image
                                        src={buildImageUrl(item.media.url)}
                                        alt={item.media.alternativeText || item.name || "Gallery Image"}
                                        width={550}
                                        height={750}
                                        className="w-full h-full object-cover object-center rounded-md"
                                    />
                                )}
                            </article>
                        </FadeInObserver>
                    ))
                )}
            </div>
            <Link href="/gallery" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto mb-10 sm:mb-12 md:mb-16 lg:mb-20 px-6 py-3 text-sm sm:text-base text-pk border border-pk rounded-md cursor-pointer hover:bg-pk/10 transition-colors">
                    {t.home.showMore}
                </button>
            </Link>
        </>
    );
}