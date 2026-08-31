# pintor-valencia.com — proyecto Astro

Migración de WordPress + Elementor a sitio estático. **118 páginas, sin JavaScript de cliente.**

---

## Qué se ha migrado

| | |
|---|---|
| Páginas | 118 (117 interiores + portada) |
| URLs conservadas | **todas**: las 114 con datos en Search Console están las 114 |
| Tarjetas reconstruidas | 1.123 |
| Preguntas en acordeón `<details>` | 1.107, en 114 páginas |
| Rejillas | 225 |
| Imágenes referenciadas | 121, con su ruta original de `/wp-content/uploads/` |

Cada página lleva `title` y `meta description` resueltos desde Yoast, `canonical`, Open Graph,
`twitter:card` y JSON-LD con `Organization`, `BreadcrumbList`, `WebPage` y `FAQPage`.

---

## Lo que falta antes de apuntar el dominio

| Dónde | Qué |
|---|---|
| `public/wp-content/uploads/` | **Copiar la carpeta uploads de WordPress.** Sin ella se ven marcadores |
| `src/data/site.json` | `email` de contacto |
| `src/data/site.json` | `formulario.accessKey` de [web3forms.com](https://web3forms.com) |
| `src/data/site.json` | `verificaciones.google` y `verificaciones.bing` |
| `src/data/site.json` | `analytics.google` (`G-XXXXXXX`); vacío = no se inserta nada |
| `public/` | Los tres archivos de favicon (ver más abajo) |
| `src/content/pages/aviso-legal.json` y las otras 3 legales | Contenido y datos fiscales |

Las 4 páginas legales llegaron **vacías** del export de WordPress y están en `noindex`.
Se quita borrando `"noindex": true` de su JSON cuando se les escriba el contenido.

### Favicon

Van en `public/`, con la keyword del sitio en el nombre — el `<head>` ya los enlaza:

- `pintor-valencia-favicon.ico`
- `pintor-valencia-favicon-96x96.png`
- `pintor-valencia-apple-touch-icon.png` (180×180)

El `theme-color` está puesto en `#1f4e79`. Cámbialo en `Base.astro` si la marca es otro azul.

---

## Desplegar en Netlify

```bash
git init
git add .
git commit -m "Migración de WordPress a Astro"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/pintor-valencia.git
git push -u origin main
```

En Netlify: **Add new site → Import an existing project → GitHub**. Lee `netlify.toml` y
configura sola la build (`npm run build`, carpeta `dist`). **No cambies nada en el panel.**

### Antes de apuntar el dominio

1. **Bloquear la URL temporal.** `nombre.netlify.app` se indexa sola y duplica todo el sitio
   mientras WordPress siga vivo. Netlify → Site settings → Build & deploy → Post processing.
2. Comprobar en la URL temporal:
   - Las 118 páginas cargan y el menú funciona (Servicios con 12, Zonas con 95)
   - El formulario de `/contacto/` y `/presupuesto/` envía y redirige a `/gracias/`
   - `/sitemap.xml` lista 115 URLs y `/robots.txt` responde
   - Una URL inventada da el 404 propio
   - `/sitemap_index.xml` redirige a `/sitemap.xml`
3. **Solo entonces** apuntar el dominio. WordPress se apaga al final, no antes.

---

## Estructura

```
src/
  content/pages/*.json   118 páginas generadas desde el WXR
  pages/
    index.astro          portada
    [...slug].astro      las 117 interiores, una sola ruta dinámica
    gracias.astro        destino del formulario (noindex)
    404.astro
    sitemap.xml.js
  layouts/Base.astro     head, JSON-LD, hero, GA, favicon
  components/            Header, Footer, Migas, ContactForm
  data/site.json         menú, pie, formulario, verificaciones, analytics
  data/heroes.json       imagen principal de cada página
  utils/imagenes.js      marcador .svg si el archivo aún no existe
  styles/global.css      sistema de diseño en variables CSS
public/
  wp-content/uploads/    imágenes migradas CON SU RUTA ORIGINAL
  _redirects, robots.txt
```

**Importante:** las rutas bajo `/wp-content/uploads/` **no se renombran nunca**. Google tiene
indexadas al menos 10 imágenes del sitio en Google Imágenes.

---

## Regenerar desde WordPress

Solo si vuelves a exportar el XML:

```bash
python3 extraer.py     # XML -> src/content/pages/*.json
```

`extraer.py` recorre las 118 páginas del export y reconstruye lo que Elementor pintaba:
rachas de `h2 + imagen + p + enlace` en rejillas de tarjetas, titulares acabados en `?` en
acordeones `<details>`, rachas de enlaces sueltos en filas de píldoras. Limpia URLs absolutas,
estilos en línea y los restos de Contact Form 7, y añade `loading="lazy"` a imágenes e iframes.

En esta web **no hace falta `partir.py`**: el silo ya viene hecho de WordPress, cada servicio
tiene su URL propia y la página madre `/servicios-pintura/` enlaza a las 12.

---

## Deuda técnica conocida

Está documentado en el proyecto (`claude/baseline-seo-pre-migracion.md` e
`claude/inventario-wxr.md`), pero conviene tenerlo aquí también:

- **Las 95 páginas de zona son un 92 % idénticas entre sí.** Cada una tiene ~2.100 palabras de
  las que ~175 son propias. Es el patrón que Google trata como contenido escalado y encaja con
  la caída de posición media de 23 a 37 en los últimos 16 meses. La migración se hizo como
  réplica fiel a propósito, para aislar la variable: si tras el cambio sube, fue lo técnico.
  **Diferenciar esas páginas sigue pendiente.**
- `/baratos/` y `/economicos/` son idénticas al 86 % y compiten por la misma intención.
  Se han migrado las dos por decisión expresa; la fusión con 301 queda pendiente.
- 29 páginas no tienen imagen propia de cabecera (marcadas `PENDIENTE` en `heroes.json`),
  entre ellas `/precio/`, que es la página con más impresiones del sitio.
- `/precio/` y la portada suman el 42 % de las impresiones y el CTR es del 0,26 % y 0,17 %.
  Reescribir sus meta títulos es la acción con más recorrido de todo el sitio.
