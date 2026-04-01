# landing-ana

**Monorepo** para un sitio web de portafolio de maquillaje con CMS integrado. Incluye un frontend moderno con Next.js y un backend API con Strapi.

---

## 📋 Tabla de contenidos

- [Arquitectura](#arquitectura)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Desarrollo](#desarrollo)
- [Producción](#producción)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Tecnologías](#tecnologías)
- [Variables de entorno](#variables-de-entorno)

---

## 🏗️ Arquitectura

Este es un **monorepo** con dos aplicaciones independientes:

```
landing-ana/
├── front/          → Next.js 16 (Frontend)
├── back/           → Strapi 5 (CMS + API)
└── package.json    → Workspace root
```

### **Dependencias entre módulos**

- **Frontend** → consume API REST de Strapi (`/api/*`)
- **Backend** → sirve contenido y gestiona medios (imágenes, archivos)
- **Independientes** → pueden ejecutarse por separado

---

## 📦 Requisitos previos

- **Node.js**: >= 20.0.0 <= 24.x.x
- **npm**: >= 6.0.0
- **Bun** (opcional, pero recomendado): [Instalar Bun](https://bun.com)
- **Git**

### Validar versiones

```bash
node --version   # v20.x.x o superior
npm --version    # 6.0.0 o superior
bun --version    # (opcional)
```

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd landing-ana
```

### 2. Instalar dependencias del monorepo

```bash
# Con npm
npm install

# O con Bun (más rápido)
bun install
```

Esto instala automáticamente las dependencias de ambas aplicaciones (`front/` y `back/`).

### 3. Configurar variables de entorno

#### Frontend: `front/.env`

```env
# Strapi Configuration
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# Social Media
NEXT_PUBLIC_WHATSAPP_NUMBER=5493872143307
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/5493872143307
NEXT_PUBLIC_TIKTOK_URL=https://www.tiktok.com/@tunegocio
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/tunegocio
NEXT_PUBLIC_FACEBOOK_URL=https://www.facebook.com/tunegocio

# Contact
NEXT_PUBLIC_CONTACT_EMAIL=nicocuello122@gmail.com

# Email Service
RESEND_TOKEN=your_resend_token_here
```

#### Backend: `back/.env`

Crear según la configuración de Strapi (base de datos, JWT, etc.).

---

## 💻 Desarrollo

### Ejecutar todo (Frontend + Backend)

```bash
npm run dev
```

Esto lanza simultáneamente:
- **Frontend**: http://localhost:3000 (Next.js)
- **Backend**: http://localhost:1337 (Strapi)

### Ejecutar solo Frontend

```bash
npm run dev:front
```

- Acceso: http://localhost:3000
- Requiere que el Backend esté corriendo en puerto 1337

### Ejecutar solo Backend

```bash
npm run dev:back
```

- Acceso: http://localhost:1337
- Admin: http://localhost:1337/admin

---

## 🏭 Producción

### 1. Build (compilación)

```bash
npm run build
```

Compila ambas aplicaciones:
- `front/` → Optimizado para Next.js
- `back/` → Compilado para Strapi

### 2. Ejecutar en producción

```bash
npm run start
```

Inicia simultáneamente:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:1337

### 3. Ejecutar solo Frontend

```bash
npm run start:front
```

### 4. Ejecutar solo Backend

```bash
npm run start:back
```

---

## 📂 Estructura del proyecto

```
landing-ana/
├── front/                          → Frontend (Next.js 16)
│   ├── src/
│   │   ├── app/                   → Rutas y layouts de Next.js
│   │   │   ├── page.tsx           → Página home
│   │   │   ├── gallery/page.tsx   → Galería completa
│   │   │   ├── about/page.tsx     → Página about
│   │   │   ├── contact/page.tsx   → Contacto
│   │   │   └── api/send/          → Endpoint para enviar emails
│   │   ├── core/                  → Lógica central
│   │   │   ├── http/              → Cliente HTTP y utilidades
│   │   │   │   ├── build-image-url.ts      → Constructor de URLs de imágenes
│   │   │   │   ├── http-client.ts          → Cliente HTTP reutilizable
│   │   │   │   └── http-get-*.ts           → Endpoints específicos
│   │   │   ├── types/             → Tipos TypeScript (respuestas Strapi)
│   │   │   ├── i18n/              → Internacionalización
│   │   │   └── context/           → Context API (locale, etc)
│   │   ├── features/              → Características por dominio
│   │   │   ├── gallery/           → Lógica de galería
│   │   │   ├── home/              → Lógica del home
│   │   │   └── about/             → Lógica de about
│   │   ├── shared/                → Componentes reutilizables
│   │   │   ├── components/        → UI compartido
│   │   │   ├── hooks/             → Custom hooks
│   │   │   └── types/             → Tipos generales
│   │   └── config/                → Configuraciones (fonts, etc)
│   ├── public/                    → Archivos estáticos (imágenes, SVGs)
│   ├── next.config.ts             → Configuración de Next.js
│   ├── tsconfig.json              → Configuración TypeScript
│   ├── tailwind.config.js          → Tailwind CSS
│   ├── .env                       → Variables de entorno
│   └── .env.example               → Plantilla de variables
│
├── back/                           → Backend (Strapi 5)
│   ├── src/
│   │   ├── api/                   → APIs y modelos
│   │   │   ├── gallery/           → Content type: Galería
│   │   │   ├── gallery-type/      → Content type: Tipo de galería
│   │   │   ├── home/              → Content type: Home
│   │   │   └── about/             → Content type: About
│   │   ├── admin/                 → Panel admin (opcional)
│   │   ├── extensions/            → Extensiones personalizadas
│   │   └── index.ts               → Entry point
│   ├── public/
│   │   ├── robots.txt
│   │   └── uploads/               → Archivos cargados (imágenes, etc)
│   ├── config/                    → Configuración (server, DB, plugins)
│   ├── database/
│   │   └── migrations/            → Migraciones de BD
│   ├── .env                       → Variables de entorno
│   └── types/generated/           → Tipos generados automáticamente
│
├── package.json                   → Workspace root
├── bun.lock                       → Lock file (si usas Bun)
└── README.md                      → Este archivo
```

---

## 🛠️ Tecnologías

### Frontend

- **Next.js 16** - Framework React SSR/SSG
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS
- **Framer Motion** - Animaciones
- **Lucide React** - Iconos
- **Resend** - Servicio de emails

### Backend

- **Strapi 5** - CMS headless
- **SQLite (better-sqlite3)** - Base de datos
- **React 18** - Panel admin
- **TypeScript 5** - Type safety

---

## 🔑 Variables de entorno

### Frontend (`front/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_STRAPI_URL` | URL base del API de Strapi | `http://localhost:1337` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número WhatsApp | `5493872143307` |
| `NEXT_PUBLIC_WHATSAPP_URL` | URL de WhatsApp | `https://wa.me/5493872143307` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Email de contacto | `contact@example.com` |
| `RESEND_TOKEN` | Token de Resend (emails) | `re_XXXXX...` |

**Nota:** Variables que comienzan con `NEXT_PUBLIC_` son visibles en el cliente.

### Backend (`back/.env`)

Configura según necesidad:
- `NODE_ENV` - Entorno (development/production)
- `DATABASE_FILENAME` - Ruta BD SQLite
- `JWT_SECRET` - Secret para tokens
- `ADMIN_JWT_SECRET` - Secret admin
- Otros según plugins activos

---

## 🖼️ Gestión de imágenes

### Construcción de URLs

Las imágenes desde Strapi se construyen usando `buildImageUrl()` ubicado en `front/src/core/http/build-image-url.ts`:

```typescript
import { buildImageUrl } from "@/core/http/build-image-url";

// Uso en componentes
const imageUrl = buildImageUrl(item.media.url);
<Image src={imageUrl} alt="..." width={550} height={700} />
```

### Optimización

Next.js en producción **NO optimiza** imágenes de Strapi por defecto (para evitar errores 400). Todas están configuradas en `next.config.ts`:

```typescript
unoptimized: true  // Imágenes servidas tal cual por Strapi
```

---

## 📝 Scripts disponibles

### Desde la raíz del monorepo

```bash
npm run dev              # Frontend + Backend en desarrollo
npm run dev:front       # Solo Frontend
npm run dev:back        # Solo Backend

npm run build           # Build ambas aplicaciones
npm run build:front     # Build solo Frontend
npm run build:back      # Build solo Backend

npm run start           # Inicia ambas en producción
npm run start:front     # Inicia solo Frontend
npm run start:back      # Inicia solo Backend
```

### En cada workspace

```bash
# Frontend
cd front && npm run dev
cd front && npm run build
cd front && npm run lint

# Backend
cd back && npm run develop
cd back && npm run build
cd back && npm run console
```

---

## 🚨 Troubleshooting

### Error: "Cannot find module 'strapi'"

```bash
npm install -g @strapi/cli
cd back && npm install
```

### Imágenes no cargan (error 400)

- Verifica `NEXT_PUBLIC_STRAPI_URL` en `front/.env`
- Asegúrate que Strapi está corriendo en puerto 1337
- Revisa en `next.config.ts` los `remotePatterns`

### Puerto 3000 o 1337 ya en uso

```bash
# Cambiar puerto Frontend (Next.js)
npm run dev:front -- -p 3001

# Cambiar puerto Backend (Strapi)
npm run dev:back -- --strapi --server.port=1338
```

### Base de datos Strapi corrupta

```bash
# Eliminar y reiniciar
cd back
rm -rf .tmp
npm run develop
```

---

## 📚 Documentación adicional

- [Next.js Docs](https://nextjs.org/docs)
- [Strapi Docs](https://docs.strapi.io/dev-docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

---

## 📄 Licencia

Privado - Proyecto Ana

---

**Última actualización:** Abril 2026
