'use client';
import { httpGetGallery } from "@/core/http/http-get-gallery";
import { httpGetTypesOfGalleries } from "@/core/http/http-get-types-of-galleries";
import { buildImageUrl } from "@/core/http/build-image-url";
import { GalleryResponse } from "@/core/types/http-gallery.types";
import { TypeOfGalleryItem } from "@/core/types/http-types-of-galleries.types";
import FadeInObserver from "@/shared/components/common/fade-in-observer";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale } from "@/core/context/locale-context";
import { useTranslations } from "@/core/i18n/use-translations";

export default function Gallery() {
    const [galleryData, setGalleryData] = useState<GalleryResponse | null>(null);
    const [categories, setCategories] = useState<TypeOfGalleryItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);
    const { locale } = useLocale();
    const t = useTranslations();
    const pageSize = 9;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await httpGetTypesOfGalleries(locale);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, [locale]);

    useEffect(() => {
        const fetchGallery = async () => {
            setIsLoading(true);
            try {
                const typeDocumentId = selectedCategory === "all" ? undefined : selectedCategory;
                const galleryData = await httpGetGallery(1, pageSize, typeDocumentId, locale);
                setGalleryData(galleryData);
                setCurrentPage(1);
                console.log("Gallery Data successfully fetched");
            }
            catch (error) {
                console.error("Error fetching gallery data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchGallery();
    }, [selectedCategory, locale]);

    const loadMore = async () => {
        if (!galleryData || isLoading) return;

        setIsLoading(true);
        try {
            const nextPage = currentPage + 1;
            const typeDocumentId = selectedCategory === "all" ? undefined : selectedCategory;
            const newData = await httpGetGallery(nextPage, pageSize, typeDocumentId, locale);

            setGalleryData({
                data: [...galleryData.data, ...newData.data],
                meta: newData.meta,
            });
            setCurrentPage(nextPage);
            console.log("More gallery data loaded:", newData);
        } catch (error) {
            console.error("Error loading more gallery data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const hasMore = galleryData?.meta?.pagination &&
        galleryData.meta.pagination.page < galleryData.meta.pagination.pageCount;

    const openModal = (imageUrl: string, alt: string) => {
        setSelectedImage({ url: imageUrl, alt });
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };

        if (selectedImage) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [selectedImage]);

    return (
        <section className="flex flex-col items-center min-h-screen pb-50">
            <div className="flex flex-wrap w-fit justify-between oswald gap-2 mb-8 p-2 bg-white/5 border border-white/5 rounded-md">
                <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-6 py-2 rounded-sm min-w-25 cursor-pointer duration-500 transition-all ${selectedCategory === "all"
                        ? "bg-pk text-white"
                        : " text-pk hover:bg-pk/10"
                        }`}
                >
                    {t.gallery.all}
                </button>
                {categories.map((category) => (
                    <button
                        key={category.documentId}
                        onClick={() => setSelectedCategory(category.documentId)}
                        className={`px-6 py-2 rounded-sm min-w-25 cursor-pointer duration-500 transition-all ${selectedCategory === category.documentId
                            ? "bg-pk text-white"
                            : " text-pk hover:bg-pk/10"
                            }`}
                    >
                        {category.name.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {!galleryData ? (
                    Array.from({ length: pageSize }).map((_, index) => (
                        <article key={`skeleton-${index}`} className=" w-full h-full max-w-137.5 max-h-175 rounded-md overflow-hidden">
                            <div className="flex w-full h-full bg-white/20 min-w-137.5 min-h-125 sm:min-h-175 animate-pulse rounded-md" />
                        </article>
                    ))
                ) : (
                    galleryData.data.map((item, index) => (
                        <FadeInObserver key={item.id} delay={(index % pageSize) * 0.1}>
                            <article
                                className="w-full h-full max-w-137.5 max-h-175 rounded-md overflow-hidden cursor-pointer transition-all duration-1000 border-2 border-transparent hover:border-pk"
                                onClick={() => item.media && openModal(buildImageUrl(item.media.url), item.media.alternativeText || item.name || "Gallery Image")}
                            >
                                {item.media && (
                                    <Image
                                        src={buildImageUrl(item.media.url)}
                                        alt={item.media.alternativeText || item.name || "Gallery Image"}
                                        className="w-full h-full min-h-125 sm:min-h-175 object-cover object-center rounded-md"
                                        width={550}
                                        height={700}
                                    />
                                )}
                            </article>
                        </FadeInObserver>
                    ))
                )}
            </div>

            {hasMore && (
                <button
                    onClick={loadMore}
                    disabled={isLoading}
                    className="mt-8 px-6 py-3 text-pk border border-pk rounded-md cursor-pointer hover:bg-pk/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? t.gallery.loading : t.gallery.showMore}
                </button>
            )}

            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    onClick={closeModal}
                >
                    <button
                        className="absolute flex items-center justify-center rounded-full top-4 right-4 bg-white/10 backdrop-blur-lg z-50 w-10 h-10 text-4xl hover:text-red-500 cursor-pointer transition-colors"
                        onClick={closeModal}
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>
                    <div className="relative max-w-7xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={selectedImage.url}
                            alt={selectedImage.alt}
                            className="object-contain w-full h-full"
                            width={1920}
                            height={1080}
                            quality={100}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
