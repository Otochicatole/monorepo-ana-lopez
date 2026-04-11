'use client';
import Image from "next/image";
import { httpGetAbout } from "@/core/http";
import { useTranslations } from "@/core/i18n/use-translations";
import { useEffect, useState } from "react";
import { AboutResponse } from "@/core/types/http-about.types";

export default function AboutPage() {
    const t = useTranslations();
    const [data, setData] = useState<AboutResponse['data'] | null>(null);
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const locale = localStorage.getItem('user-locale') as 'en' | 'es-AR' || 'en';
                const response = await httpGetAbout(locale);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching about data:', error);
            }
        };
        fetchData();
    }, []);

    if (!data) return null;

    return (
        <main className="min-h-screen py-40 px-6 lg:px-10">
            <header className="max-w-5xl mx-auto">
                <h1 className="oswald text-4xl ml-3 lg:ml-0 lg:text-6xl mb-8">{t.pages.aboutMe}</h1>
            </header>
            <section className="max-w-5xl mx-auto flex flex-col">
                <article className="flex flex-col lg:flex-row-reverse mt-6 gap-4 lg:gap-0">
                    <p className="text-base lg:text-lg leading-relaxed p-4 lg:p-6 whitespace-pre-line w-full">
                        {data.Text1}
                    </p>
                    {data.Image1 && (
                        <div className="relative w-full aspect-square">
                            <Image
                                src={`${baseUrl}${data.Image1.url}`}
                                alt={data.Image1.alternativeText || "About image 1"}
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                    )}
                </article>

                <article className="flex flex-col lg:flex-row mt-6 gap-4 lg:gap-0">
                    <p className="text-base lg:text-lg leading-relaxed p-4 lg:p-6 whitespace-pre-line w-full">
                        {data.Text2}
                    </p>
                    {data.Image2 && (
                        <div className="relative w-full aspect-square">
                            <Image
                                src={`${baseUrl}${data.Image2.url}`}
                                alt={data.Image2.alternativeText || "About image 2"}
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                    )}
                </article>

                <article className="flex flex-col lg:flex-row-reverse mt-6 gap-4 lg:gap-0">
                    <p className="text-base lg:text-lg leading-relaxed p-4 lg:p-6 whitespace-pre-line w-full">
                        {data.Text3}
                    </p>
                    {data.Image3 && (
                        <div className="relative w-full aspect-square">
                            <Image
                                src={`${baseUrl}${data.Image3.url}`}
                                alt={data.Image3.alternativeText || "About image 3"}
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                    )}
                </article>
            </section>
            <section className="flex flex-col lg:flex-row mt-20 lg:mt-50 max-w-5xl mx-auto gap-8 lg:gap-20">
                <article className="flex flex-col items-center justify-center text-center">
                    <h3 className="text-pk text-xl lg:text-2xl">{t.about.technicalExpertise.title}</h3>
                    <p className="text-white/60 text-sm">{t.about.technicalExpertise.description}</p>
                </article>
                <article className="flex flex-col items-center justify-center text-center">
                    <h3 className="text-pk text-xl lg:text-2xl">{t.about.aestheticSensibility.title}</h3>
                    <p className="text-white/60 text-sm">{t.about.aestheticSensibility.description}</p>
                </article>
                <article className="flex flex-col items-center justify-center text-center">
                    <h3 className="text-pk text-xl lg:text-2xl">{t.about.personalizedService.title}</h3>
                    <p className="text-white/60 text-sm">{t.about.personalizedService.description}</p>
                </article>
            </section>
        </main>
    );
}
