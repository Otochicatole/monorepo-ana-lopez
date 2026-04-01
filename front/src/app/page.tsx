import { httpGetHome } from "@/core/http/http-get-home";
import CardAbout from "@/features/home/components/ui/card-about";
import Works from "@/features/home/components/ui/works";
import { getServerLocale } from "@/core/context/get-server-locale";
import FadeInObserverSides from "@/shared/components/common/fade-in-observer-sides";
import ScrollNextSection from "@/shared/components/common/scroll-into-view";
import { ArrowDown } from "lucide-react";

export default async function HomePage() {
  const locale = await getServerLocale();
  const homeData = await httpGetHome(locale);

  const { about, imageAbout } = homeData.data;

  const aboutData = {
    description: about,
    image: imageAbout.url,
  };

  return (
    <main className="flex flex-col overflow-x-hidden">
      <header className="relative flex flex-col min-h-screen bg-[url('/images/header.png')] bg-no-repeat bg-cover bg-center">
        <FadeInObserverSides className="absolute top-3 left-3 sm:left-6 md:left-8 lg:left-6">
          <h1 className="bodoni-moda-sc text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[140px]">ANA LOPEZ</h1>
        </FadeInObserverSides>
        <FadeInObserverSides className="absolute top-20 sm:top-1/2 right-2 sm:right-4 md:right-6 lg:right-0" animation="right" delay={0.5}>
          <h2 className="oswald text-pk tracking-[4px] sm:tracking-[8px] md:tracking-[12px] lg:tracking-[16px] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[64px]">MAKEUP ARTIST</h2>
        </FadeInObserverSides>
        <ScrollNextSection
          className="absolute bottom-5 left-5 transition-all duration-500 bg-white/10 backdrop-blur-lg border border-white/10 p-3 rounded-sm cursor-pointer"
          targetId="about-section"
        >
          <ArrowDown />
        </ScrollNextSection>
      </header>
      <section id="about-section" className="flex flex-col p-2.5 sm:p-4 md:p-6 lg:p-8 xl:p-2.5">
        <CardAbout {...aboutData} />
      </section>
      <section className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <Works />
      </section>
    </main>
  );
}
