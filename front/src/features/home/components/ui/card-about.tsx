'use client';
import Image from "next/image";

interface CardAboutProps {
    description: string;
    image: string;
}

export default function CardAbout({ description, image }: CardAboutProps) {

    const url = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const srcImage = url + image;

    return (
        <>
            <article className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-12.5 p-6 sm:p-8 md:p-10 lg:p-15 h-full items-center rounded-md bg-white/5 backdrop-blur-sm">
                <Image
                    src={srcImage}
                    alt="About Ana"
                    width={250}
                    height={250}
                    className="rounded-md lg:block hidden w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-60 lg:h-60 xl:w-62.5 xl:h-62.5 object-cover shrink-0"
                />
                <div className="flex flex-col h-full justify-between gap-4 md:gap-6">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                        <h2 className="oswald text-3xl sm:text-4xl md:text-5xl lg:text-6xl">About Ana</h2>
                        <span className="text-pk tracking-[3px] sm:tracking-[4px] md:tracking-[6px] text-sm sm:text-base sm:mt-4">MAKEUP ARTIST</span>
                    </div>
                    <p className="text-base sm:text-lg md:text-[20px] leading-relaxed">
                        {description}
                    </p>
                </div>
            </article>
        </>
    );
}