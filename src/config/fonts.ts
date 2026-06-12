import { Bodoni_Moda_SC, Carattere, Geist, Geist_Mono, Inter, Oswald } from "next/font/google";

/**
 * Configuración de fuentes de Google optimizadas con next/font
 *
 * Este módulo centraliza la configuración de todas las fuentes
 * utilizadas en la aplicación, facilitando su mantenimiento y reutilización.
 */

export const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const carattere = Carattere({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-carattere",
});

export const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const bodoniModaSC = Bodoni_Moda_SC({
    subsets: ["latin"],
    variable: "--font-bodoni-moda-sc",
});

export const oswald = Oswald({
    subsets: ["latin"],
    variable: "--font-oswald",
});

/**
 * Genera el string de className para aplicar todas las variables CSS de fuentes
 *
 * @returns String con todas las variables de fuentes separadas por espacios
 */
export const getFontVariables = (): string => {
    return `${geistSans.variable} ${geistMono.variable} ${carattere.variable} ${inter.variable} ${bodoniModaSC.variable} ${oswald.variable}`;
};
