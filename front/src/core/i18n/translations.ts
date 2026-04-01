export type Locale = 'en' | 'es-AR';

export type TranslationStructure = {
    nav: {
        home: string;
        gallery: string;
        about: string;
        contact: string;
    };
    footer: {
        artOfMakeup: string;
        description: string;
        followUs: string;
        links: string;
        contact: string;
        allRightsReserved: string;
    };
    pages: {
        aboutMe: string;
        gallery: string;
    };
    about: {
        technicalExpertise: {
            title: string;
            description: string;
        };
        aestheticSensibility: {
            title: string;
            description: string;
        };
        personalizedService: {
            title: string;
            description: string;
        };
    };
    home: {
        latestWorks: string;
        showMore: string;
    };
    gallery: {
        all: string;
        showMore: string;
        loading: string;
    };
    contact: {
        name: string;
        lastName: string;
        phone: string;
        message: string;
        sendMessage: string;
        sending: string;
        successMessage: string;
        errorMessage: string;
    };
    aria: {
        selectLanguage: string;
        switchToEnglish: string;
        switchToSpanish: string;
        openMenu: string;
        closeMenu: string;
    };
};

export const translations: Record<Locale, TranslationStructure> = {
    en: {
        // Navigation
        nav: {
            home: 'Home',
            gallery: 'Gallery',
            about: 'About Me',
            contact: 'Contact',
        },
        // Footer
        footer: {
            artOfMakeup: 'The Art of Makeup',
            description: 'Makeup gives meaning to light, color, and emotion, turning every detail into art and every look into a story.',
            followUs: 'Follow us',
            links: 'Links',
            contact: 'Contact',
            allRightsReserved: 'All rights reserved.',
        },
        // Pages
        pages: {
            aboutMe: 'About Me',
            gallery: 'Gallery',
        },
        // About
        about: {
            technicalExpertise: {
                title: 'Technical Expertise',
                description: 'Professional techniques adapted to every skin type and face shape.',
            },
            aestheticSensibility: {
                title: 'Aesthetic Sensibility',
                description: 'A refined eye for detail that enhances natural beauty.',
            },
            personalizedService: {
                title: 'Personalized Service',
                description: 'A thoughtful, client-focused experience from start to finish.',
            },
        },
        // Home
        home: {
            latestWorks: 'Latest Works',
            showMore: 'Show more',
        },
        // Gallery
        gallery: {
            all: 'ALL',
            showMore: 'Show more',
            loading: 'Loading...',
        },
        // Contact
        contact: {
            name: 'Name...',
            lastName: 'Last Name...',
            phone: 'Phone...',
            message: 'Message...',
            sendMessage: 'Send Message',
            sending: 'Sending...',
            successMessage: 'Message sent successfully!',
            errorMessage: 'Error sending message. Please try again.',
        },
        // Aria labels
        aria: {
            selectLanguage: 'Select language',
            switchToEnglish: 'Switch to English',
            switchToSpanish: 'Switch to Spanish',
            openMenu: 'Open menu',
            closeMenu: 'Close menu',
        },
    },
    'es-AR': {
        // Navigation
        nav: {
            home: 'Inicio',
            gallery: 'Galería',
            about: 'Sobre Mí',
            contact: 'Contacto',
        },
        // Footer
        footer: {
            artOfMakeup: 'El Arte del Maquillaje',
            description: 'El maquillaje da sentido a la luz, el color y la emoción, convirtiendo cada detalle en arte y cada look en una historia.',
            followUs: 'Seguinos',
            links: 'Enlaces',
            contact: 'Contacto',
            allRightsReserved: 'Todos los derechos reservados.',
        },
        // Pages
        pages: {
            aboutMe: 'Sobre Mí',
            gallery: 'Galería',
        },
        // About
        about: {
            technicalExpertise: {
                title: 'Experiencia Técnica',
                description: 'Técnicas profesionales adaptadas a cada tipo de piel y forma de rostro.',
            },
            aestheticSensibility: {
                title: 'Sensibilidad Estética',
                description: 'Un ojo refinado para el detalle que realza la belleza natural.',
            },
            personalizedService: {
                title: 'Servicio Personalizado',
                description: 'Una experiencia cuidada y centrada en el cliente de principio a fin.',
            },
        },
        // Home
        home: {
            latestWorks: 'Últimos Trabajos',
            showMore: 'Ver más',
        },
        // Gallery
        gallery: {
            all: 'TODOS',
            showMore: 'Ver más',
            loading: 'Cargando...',
        },
        // Contact
        contact: {
            name: 'Nombre...',
            lastName: 'Apellido...',
            phone: 'Teléfono...',
            message: 'Mensaje...',
            sendMessage: 'Enviar Mensaje',
            sending: 'Enviando...',
            successMessage: '¡Mensaje enviado con éxito!',
            errorMessage: 'Error al enviar el mensaje. Por favor, intentá de nuevo.',
        },
        // Aria labels
        aria: {
            selectLanguage: 'Seleccionar idioma',
            switchToEnglish: 'Cambiar a Inglés',
            switchToSpanish: 'Cambiar a Español',
            openMenu: 'Abrir menú',
            closeMenu: 'Cerrar menú',
        },
    },
};
