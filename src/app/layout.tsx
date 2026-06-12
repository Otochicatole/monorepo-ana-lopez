import Nav from "@/shared/components/layout/nav";
import "./globals.css";
import { getFontVariables } from "@/config/fonts";
import Footer from "@/shared/components/layout/footer";
import FloatingButtons from "@/shared/components/layout/floating";
import { LocaleProvider } from "@/core/context/locale-context";

export const metadata = {
  title: "Ana Lopez - Makeup Artist",
  description: "Official website of Ana Lopez, a makeup artist specialized in fashion, editorial, and event makeup. Discover her portfolio, services, and contact information to transform your image with style and professionalism.",
  icons: {
    icon: '/svgs/makeup.svg',
    apple: '/svgs/makeup.svg'
  }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${getFontVariables()} antialiased`}
        suppressHydrationWarning
      >
        <LocaleProvider>
          <Nav />
          {children}
          <Footer />
          <FloatingButtons />
        </LocaleProvider>
      </body>
    </html>
  );
}
