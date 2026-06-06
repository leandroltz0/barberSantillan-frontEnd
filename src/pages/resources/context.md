# Proyecto Web — Santillán Barbería

## Resumen del proyecto

Sitio web para **Santillán**, un barbero independiente que trabaja desde su casa en Moreno con una clientela consolidada. El objetivo de la página es mostrar el trabajo, generar confianza, y facilitar el contacto por WhatsApp. No es una barbería de cadena — tiene identidad propia, cercana y artesanal.

---

## Datos del cliente

| Campo           | Valor                                        |
| --------------- | -------------------------------------------- |
| Nombre / marca  | Santillán                                    |
| Dirección       | Martínez Melo 2433, Moreno, Buenos Aires     |
| WhatsApp        | +54 11 3192-0565                             |
| Horarios        | Lunes a domingo, 8:00 AM – 10:00 PM          |
| Tipo de negocio | Barbero independiente, trabaja desde su casa |

---

## Servicios y precios

| Servicio     | Precio  |
| ------------ | ------- |
| Corte franja | $18.000 |
| Claritos     | $28.000 |
| Global       | $35.000 |

> ⚠️ Los precios pueden cambiar. Mantener fácil de editar en el código (idealmente en un archivo de datos separado como `src/data/servicios.ts`).

---

## Stack tecnológico

| Capa                     | Tecnología                                            |
| ------------------------ | ----------------------------------------------------- |
| Framework frontend       | [Astro](https://astro.build)                          |
| Estilos                  | Tailwind CSS                                          |
| Animaciones              | GSAP (ScrollTrigger, gsap.from, stagger)              |
| Slider / carrusel        | Embla Carousel (liviano, sin estilos impuestos)       |
| Backend (si se necesita) | Express.js                                            |
| Deploy (sugerido)        | Vercel o Netlify (Astro tiene adaptadores para ambos) |

**Sin librería de componentes UI.** La decisión es explícita: este proyecto no usa shadcn, DaisyUI, Flowbite ni similares. Todo se construye a medida con Tailwind para mantener identidad visual fuerte y evitar estilos genéricos predefinidos. La única excepción es **Embla Carousel**, que es un headless slider sin ninguna opinión de diseño — solo lógica de scroll, los estilos los ponemos nosotros.

---

## Identidad visual

### Estilo

**"Artesano urbano"** — oscuro, con personalidad, profesional pero cercano. Que transmita que es alguien que sabe lo que hace, no una cadena de franquicias.

### Paleta de colores (propuesta)

```
--color-bg:        #0d0d0d  (negro profundo, fondo principal)
--color-surface:   #1a1a1a  (superficies / cards)
--color-accent:    #c9a84c  (dorado cálido, detalles y CTAs)
--color-text:      #f0ece4  (crema / blanco cálido)
--color-muted:     #888888  (textos secundarios)
```

### Tipografía (propuesta)

- **Display / Títulos:** `Playfair Display` o `Cormorant Garamond` — elegante, con personalidad
- **Cuerpo / UI:** `DM Sans` o `Outfit` — legible, moderno, sin ser genérico
- Fuentes vía Google Fonts

### Logo / Ícono personalizado

- Crear un logotipo de texto con el nombre **"Santillán"** estilizado
- Usado en: favicon, pantalla de carga (loader), header del sitio, footer
- Sugerencia: lettering con serif en el apellido + un detalle gráfico simple (tijeras, navaja, línea decorativa)
- Formato: SVG (escalable, liviano)

---

## Secciones de la página

### 1. Loader / Pantalla de carga

- Animación de entrada con el logo "Santillán"
- GSAP: fade in + pequeña animación del logo, luego fade out antes de mostrar el sitio
- Solo se muestra la primera vez (o cada visita, a definir)

### 2. Hero

- Nombre grande: **SANTILLÁN**
- Slogan corto (a definir con el cliente, sugerencia: _"El corte que te define"_ o _"Estilo con identidad"_)
- Fondo: foto de ambiente o foto de corte impactante
- CTA principal: botón **"Reservar turno"** → abre WhatsApp
- Animación de entrada con GSAP (stagger de elementos)

### 3. Galería de cortes

- Grid de fotos reales provistas por el cliente
- Hover effect: zoom suave o overlay con nombre del estilo
- Animación: scroll reveal con GSAP ScrollTrigger (stagger de cards)
- Posible filtrado por tipo (corte, barba, claritos, global) — evaluar complejidad

### 4. Servicios y precios

- Cards o tabla simple con los servicios
- Precio visible y claro
- Nota de contacto: "Para consultas o combos, escribinos"
- Animación: fade in al hacer scroll

### 5. Sobre Santillán

- Foto del barbero o del espacio de trabajo
- Texto breve: quién es, cuánto tiempo lleva, su filosofía
- **Contenido a completar con el cliente**
- Transmitir cercanía y confianza

### 6. Contacto y turno

- Botón grande de WhatsApp con número visible
- Dirección: Martínez Melo 2433, Moreno
- Horarios: Lunes a domingo 8 AM – 10 PM
- Opcional: embed de Google Maps

### 7. Footer

- Logo Santillán
- Redes sociales (Instagram principalmente — confirmar con cliente)
- Horarios resumidos
- Copyright

### Elemento flotante (en toda la página)

- Botón de WhatsApp fijo en esquina inferior derecha
- Ícono de WhatsApp + texto "¡Reservá tu turno!"
- Siempre visible, en mobile y desktop

---

## Animaciones planeadas (GSAP)

| Sección           | Animación                                                |
| ----------------- | -------------------------------------------------------- |
| Loader            | Logo fade in → hold → fade out, reveal del sitio         |
| Hero              | Stagger de título, subtítulo y CTA (gsap.from con delay) |
| Galería           | ScrollTrigger: cards aparecen de abajo con stagger       |
| Servicios         | ScrollTrigger: fade in con slide desde la izquierda      |
| Sobre Santillán   | ScrollTrigger: foto desde izquierda, texto desde derecha |
| WhatsApp flotante | Bounce suave en loop para llamar la atención             |

---

## Estructura de archivos sugerida (Astro)

```
santillan-web/
├── public/
│   ├── fonts/                ← si bajás las fuentes localmente
│   ├── images/
│   │   ├── hero.webp
│   │   ├── nosotros/
│   │   │   └── foto-barbero.webp
│   │   └── galeria/
│   │       ├── corte-01.webp
│   │       ├── corte-02.webp
│   │       └── ...
│   ├── icons/
│   │   └── favicon.svg
│   └── logo.svg
│
├── src/
│   ├── components/
│   │   ├── Loader.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Stats.astro
│   │   ├── Nosotros.astro
│   │   ├── Certificacion.astro
│   │   ├── Servicios.astro
│   │   ├── Opiniones.astro
│   │   ├── Galeria.astro
│   │   ├── Contacto.astro
│   │   ├── Footer.astro
│   │   └── WhatsAppButton.astro
│   │
│   ├── data/
│   │   ├── servicios.ts      ← precios y descripciones
│   │   ├── opiniones.ts      ← reseñas de clientes
│   │   └── galeria.ts        ← metadata de las fotos
│   │
│   ├── layouts/
│   │   └── Layout.astro      ← html base, head, meta, fonts
│   │
│   ├── pages/
│   │   └── index.astro       ← importa todos los componentes en orden
│   │
│   └── styles/
│       ├── global.css        ← variables CSS, reset, tipografía base
│       └── animations.css    ← keyframes de GSAP / CSS animations
│
├── astro.config.mjs
├── tsconfig.json
└── package.json

(NO DEBE USAR TAILWIND)
```

---

## Pendientes / A confirmar con el cliente

- [ ] Slogan o frase para el Hero
- [ ] Foto del barbero o del espacio de trabajo (sección "Sobre")
- [ ] Instagram u otras redes sociales
- [ ] ¿Quiere que aparezca el embed de Google Maps?
- [ ] ¿Los precios cambian seguido? (para decidir si van en un CMS simple o hardcodeados)
- [ ] Nombre definitivo de la "marca": ¿solo "Santillán" o tiene algún nombre para el local?
- [ ] ¿Tiene logo actual o lo creamos desde cero?

---

## Notas técnicas

- **Mobile-first**: el 90%+ de visitas serán desde celular. Diseñar primero para mobile.
- **Optimización de imágenes**: usar el componente `<Image />` de Astro para compresión automática de las fotos de cortes.
- **SEO local**: incluir en metadatos — "barbero Moreno", "corte de pelo Moreno Buenos Aires", "barbería Martínez Melo".
- **Performance**: las fotos son el cuello de botella. Usar formato WebP y lazy loading.
- **WhatsApp link format**: `https://wa.me/5491131920565` (formato internacional sin el 0 ni el 15).
