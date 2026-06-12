'use client';

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useTranslations } from "@/core/i18n/use-translations";
import {
  getGmailComposeHref,
  siteContact,
} from "@/config/site-contact";

export default function ContactPage() {
    const t = useTranslations();
    const gmailHref = getGmailComposeHref();
    const whatsappUrl = siteContact.whatsappUrl;
    const instagramUrl = siteContact.instagramUrl;
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', lastName: '', phone: '', message: '' });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error sending form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <main className="flex relative overflow-x-hidden flex-col items-center justify-center min-h-screen p-4 ">
                <section className="flex flex-col lg:flex-row items-center justify-center gap-10 w-full">
                    <form
                        className="flex min-h-91 items-center justify-center flex-col backdrop-blur-lg p-7.5 gap-4 w-full max-w-200 rounded-[20px]"
                        onSubmit={handleSubmit}>
                        {submitStatus === 'idle' && (
                            <>
                                <div className="flex flex-col w-full lg:flex-row gap-4">
                                    <input
                                        type="text"
                                        placeholder={t.contact.name}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                                    />
                                    <input
                                        type="text"
                                        placeholder={t.contact.lastName}
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                                    />
                                </div>
                                <input
                                    type="tel"
                                    placeholder={t.contact.phone}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                                />
                                <textarea
                                    placeholder={t.contact.message}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
                                />

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-3 w-full cursor-pointer bg-pk/80 hover:bg-pk/90 disabled:bg-white/5 disabled:cursor-not-allowed border border-white/10 text-white flex items-center justify-center transition-colors rounded-md gap-3"
                                >
                                    {isSubmitting ? t.contact.sending : t.contact.sendMessage}
                                </button>
                            </>
                        )}
                        {submitStatus === 'success' && (
                            <p className="text-3xl text-green-300 text-center">{t.contact.successMessage}</p>
                        )}
                        {submitStatus === 'error' && (
                            <p className="text-3xl text-red-300 text-center">{t.contact.errorMessage}</p>
                        )}
                    </form>
                </section>
                <div className="flex flex-row items-center justify-center gap-5 mt-3">
                    {gmailHref && (
                        <Link
                            href={gmailHref}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                className="hover:scale-110 cursor-pointer transition-all"
                                src="/svgs/mail.svg"
                                alt="Email"
                                width={30}
                                height={30}
                            />
                        </Link>
                    )}
                    {whatsappUrl && (
                        <Link
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                className="hover:scale-110 cursor-pointer transition-all"
                                src="/svgs/wp.svg"
                                alt="WhatsApp"
                                width={30}
                                height={30}
                            />
                        </Link>
                    )}
                    {instagramUrl && (
                        <Link
                            href={instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                className="hover:scale-110 cursor-pointer transition-all"
                                src="/svgs/ig.svg"
                                alt="Instagram"
                                width={30}
                                height={30}
                            />
                        </Link>
                    )}
                </div>
            </main>
        </>
    )
}
