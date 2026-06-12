"use client";
import Link from "next/link";
import { useTranslations } from "@/core/i18n/use-translations";
import {
  getMailtoHref,
  getTelHref,
  siteContact,
  socialLinks,
} from "@/config/site-contact";

export default function Footer() {
  const t = useTranslations();
  const mailtoHref = getMailtoHref();
  const telHref = getTelHref();

  return (
    <footer className="flex flex-col px-6 py-8 md:px-20 md:py-12.5 bg-white/5 backdrop-blur-lg xl:px-30">
      <div className="flex flex-wrap md:flex-row gap-8 md:gap-10 lg:justify-between">
        <article className="flex flex-col w-full md:max-w-xl">
          <h2 className="text-2xl font-bold mb-4">{t.footer.artOfMakeup}</h2>
          <p className="mb-2">{t.footer.description}</p>
        </article>
        {socialLinks.length > 0 && (
          <article>
            <h2 className="text-2xl font-bold mb-3">{t.footer.followUs}</h2>
            <ul>
              {socialLinks.map(({ label, url }) => (
                <li key={label}>
                  <Link
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pk hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        )}
        <article>
          <h2 className="text-2xl font-bold mb-3">{t.footer.links}</h2>
          <ul>
            <li>
              <Link href="/" className="hover:text-pk hover:underline">
                {t.nav.home}
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-pk hover:underline">
                {t.nav.gallery}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-pk hover:underline">
                {t.nav.contact}
              </Link>
            </li>
          </ul>
        </article>
        {(siteContact.phone ||
          siteContact.email ||
          siteContact.instagramUrl) && (
          <article className="xl:text-end">
            <h2 className="text-2xl font-bold mb-3">{t.footer.contact}</h2>
            <ul>
              {siteContact.phone && (
                <li>
                  {telHref ? (
                    <a href={telHref} className="hover:text-pk hover:underline">
                      {siteContact.phone}
                    </a>
                  ) : (
                    siteContact.phone
                  )}
                </li>
              )}
              {siteContact.email && (
                <li>
                  {mailtoHref ? (
                    <a
                      href={mailtoHref}
                      className="hover:text-pk hover:underline"
                    >
                      {siteContact.email}
                    </a>
                  ) : (
                    siteContact.email
                  )}
                </li>
              )}
              {siteContact.instagramUrl && (
                <li>
                  {siteContact.instagramUrl.replace(
                    "https://www.instagram.com/",
                    "",
                  ) && (
                    <Link
                      href={siteContact.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-pk hover:underline"
                    >
                      {siteContact.instagramUrl.replace(
                        "https://www.instagram.com/",
                        "",
                      )}
                    </Link>
                  )}
                </li>
              )}
            </ul>
          </article>
        )}
      </div>
      <div className="mt-12 md:mt-20 text-sm text-pk/60">
        <p>
          &copy; {new Date().getFullYear()} Ana Lopez.{" "}
          {t.footer.allRightsReserved}
        </p>
      </div>
    </footer>
  );
}
