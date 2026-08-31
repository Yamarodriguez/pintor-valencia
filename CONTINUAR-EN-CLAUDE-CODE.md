# Continuar la migración en Claude Code

Estado a 31/08/2026. El proyecto Astro está hecho y compila. Falta rellenar datos,
copiar imágenes, escribir 4 páginas legales y desplegar.

---

## 0. Punto de partida

En `C:\Users\Yaman\Desktop\pintor-valencia\` tienes:

```
pintor-valencia-astro.zip          <- el proyecto (descomprimir aquí)
pintorvalencia.WordPress.2026-08-31.xml
https___pintor-valencia.com_-Performance-on-Search-2026-08-31.zip
robothumanoide\                    <- proyecto de referencia
```

Descomprime el zip: debe quedar `Desktop\pintor-valencia\pintor-valencia\` con
`package.json`, `src\`, `public\`, `extraer.py` y `LEEME.md` dentro.

Abre Claude Code **en esa carpeta** (`pintor-valencia\pintor-valencia`).

### Sobre la build local

En este PC la build de Astro está bloqueada por la política WDAC de Windows.
**No la desactives.** Si `npm run build` falla por eso, es lo esperado: se valida
con `JSON.parse` y compila Netlify en su servidor Linux.

Validación que sí funciona aquí:

```bash
node -e "const fs=require('fs'),p=require('path');let n=0;(function w(d){for(const f of fs.readdirSync(d,{withFileTypes:true})){const q=p.join(d,f.name);f.isDirectory()?w(q):f.name.endsWith('.json')&&(JSON.parse(fs.readFileSync(q,'utf8')),n++)}})('src');console.log('OK '+n+' JSON')"
```

Debe decir `OK 120 JSON`.

---

## 1. Copiar las imágenes  ← lo más importante

Copia el contenido de `wp-content/uploads/` del WordPress a:

```
public\wp-content\uploads\
```

**Manteniendo la estructura de carpetas por año y mes.** Deben quedar rutas como:

```
public\wp-content\uploads\2023\11\Pintor.jpg
public\wp-content\uploads\2023\12\pintor-de-interior.jpg
public\wp-content\uploads\2024\01\pintores-Turis.jpg
```

**No renombres nada.** Google tiene indexadas al menos 10 imágenes de este sitio en
Google Imágenes.

Copia la carpeta **entera**, no solo los originales: el HTML conserva los `srcset` de
WordPress, que apuntan a las variantes `-300x300`, `-150x150`, `-1024x727`, etc.

### Verificación

El sitio referencia **189 archivos distintos** (121 originales + sus variantes de tamaño),
repartidos así: `2024/01` → 88, `2023/11` → 72, `2023/12` → 29.

Pídele a Claude Code que compruebe cuáles faltan:

> Recorre todos los `src/content/pages/*.json`, extrae cada ruta que empiece por
> `/wp-content/uploads/` (incluidas las de los `srcset`) y dime cuáles no existen en
> `public/`. Dame la lista agrupada por carpeta.

Las que falten se ven como marcador SVG gracias a `src/utils/imagenes.js`, así que la
maqueta no se rompe — pero hay que completarlas antes de apuntar el dominio.

---

## 2. Rellenar `src/data/site.json`

Cuatro huecos marcados como `PENDIENTE`:

| Clave | Qué poner |
|---|---|
| `email` | El email de contacto del negocio |
| `formulario.accessKey` | Access key de [web3forms.com](https://web3forms.com) (gratis, la mandan por email) |
| `verificaciones.google` | Solo el valor del `content` de la etiqueta de Search Console |
| `verificaciones.bing` | Solo el valor del `content` de `msvalidate.01` |
| `analytics.google` | El ID `G-XXXXXXX`. Si lo dejas vacío no se inserta nada |

**Cómo sacar las verificaciones actuales:** en la web de WordPress todavía viva, ver código
fuente y buscar `google-site-verification` y `msvalidate.01`. Copiar solo el valor de
`content="..."`, no la etiqueta entera. Si no se migran, se pierde la propiedad verificada.

El snippet de Analytics ya está en `Base.astro` con `is:inline` en los dos `<script>`.
**No le quites el `is:inline`**: sin él Astro los empaqueta como módulos y `gtag` deja de
existir en el ámbito global.

---

## 3. Favicon

Hacen falta tres archivos en `public/`, con la keyword del sitio en el nombre. El `<head>`
ya los enlaza, así que basta con dejarlos ahí:

```
public\pintor-valencia-favicon.ico            (32x32)
public\pintor-valencia-favicon-96x96.png      (96x96)
public\pintor-valencia-apple-touch-icon.png   (180x180)
```

Deja además una copia del `.ico` como `public\favicon.ico`.

El `theme-color` está en `#1f4e79` (azul) en `Base.astro`. Cámbialo si la marca es otro color.

Prompt para Claude Code si quieres generarlos desde el logo:

> Tengo `public/wp-content/uploads/2024/01/pintores-en-valencia.jpg`. Genera a partir de él
> los tres archivos de favicon con los nombres y tamaños que pide el `<head>` de
> `src/layouts/Base.astro`, más una copia como `public/favicon.ico`.

---

## 4. Escribir las 4 páginas legales

Llegaron **vacías** del export de WordPress. Están en `noindex`:

```
src/content/pages/aviso-legal.json
src/content/pages/politica-de-privacidad.json
src/content/pages/politica-de-cookies.json
src/content/pages/personalizar-cookies.json
```

Cada una necesita `h1`, `metaTitulo`, `metaDescripcion` y `html`. Para escribirlas hacen
falta los **datos fiscales**: razón social, NIF/CIF, domicilio, email y teléfono.

Cuando estén escritas, **borra la línea `"noindex": true`** de su JSON.

Prompt:

> Escribe el contenido de las 4 páginas legales de `src/content/pages/`. Datos fiscales:
> [razón social], [NIF], [domicilio], [email], [teléfono]. Usa la misma estructura de HTML
> semántico que el resto de páginas (`<section class="seccion">` + `<div class="contenedor">`
> + `<div class="prosa">`). Adapta el aviso de cookies a lo que realmente usa el sitio:
> solo Google Analytics si se ha puesto el ID, y los iframes de Google Maps de las
> páginas de zona. Al terminar, quita `"noindex": true` de los cuatro JSON.

---

## 5. Subir a GitHub y conectar Netlify

```bash
git init
git add .
git commit -m "Migración de WordPress a Astro"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/pintor-valencia.git
git push -u origin main
```

El `.gitignore` ya excluye `node_modules/`, `dist/`, el XML de WordPress (contiene el email
del administrador en texto plano) y el zip de Search Console.

En Netlify: **Add new site → Import an existing project → GitHub**, elige el repositorio.
Lee `netlify.toml` y configura sola la build. **No toques nada en el panel:** si el
formulario muestra otro comando o carpeta, déjalo en blanco y que mande el archivo.

---

## 6. Antes de apuntar el dominio

### 6.1 Bloquear la URL temporal

`nombre.netlify.app` se indexa sola y crea un duplicado de todo el sitio mientras WordPress
sigue vivo. Netlify → **Site settings → Build & deploy → Post processing** → activar el
bloqueo de indexación de los despliegues.

### 6.2 Comprobar en la URL temporal

- [ ] Las 118 páginas cargan
- [ ] El menú funciona: Servicios despliega 12, Zonas despliega 95
- [ ] El formulario de `/contacto/` y `/presupuesto/` envía y redirige a `/gracias/`
- [ ] `/sitemap.xml` lista 115 URLs
- [ ] `/robots.txt` responde
- [ ] Una URL inventada da el 404 propio
- [ ] `/sitemap_index.xml` redirige a `/sitemap.xml`
- [ ] Ninguna imagen sale como marcador SVG
- [ ] En el código fuente de 3-4 páginas: un solo `<h1>`, `canonical` correcto,
      `FAQPage` presente en las que tienen preguntas

### 6.3 Apuntar el dominio

Netlify → **Domain settings → Add custom domain**. **WordPress se apaga al final**, solo
cuando todo responda en el dominio real.

---

## 7. Después del cambio: lo que queda pendiente

Está documentado en el proyecto (`claude/baseline-seo-pre-migracion.md`), pero resumido:

1. **Reescribir el meta título y la descripción de `/precio/` y la portada.** Entre las dos
   suman el 42 % de las impresiones del sitio (143.000) y su CTR es del 0,26 % y 0,17 %.
   `/precio/` debe atacar explícitamente "cuánto cobra un pintor por hora / por m² / por día",
   que son consultas donde ya se rankea en posición 8-11 sin conseguir clics.
2. **Diferenciar las 95 páginas de zona.** Son un 92 % idénticas entre sí: ~2.100 palabras de
   las que ~175 son propias. Es contenido escalado y encaja con la caída de posición media de
   23 a 37. La migración se hizo como réplica fiel a propósito, para aislar la variable.
3. **Decidir entre `/baratos/` y `/economicos/`**, idénticas al 86 %.
4. **Completar las 29 cabeceras marcadas `PENDIENTE`** en `src/data/heroes.json`, empezando
   por `/precio/`.
5. **Medir a los 30 y 90 días** contra la tabla de `claude/baseline-seo-pre-migracion.md`.

---

## Regenerar desde el XML

Si vuelves a exportar WordPress, `extraer.py` regenera los 118 JSON. Ajusta la ruta `SRC`
del principio del archivo a donde tengas el XML nuevo. **Sobrescribe** `src/content/pages/`,
así que cualquier edición manual hecha ahí (las legales, por ejemplo) se pierde.

En esta web **no se usa `partir.py`**: el silo ya venía hecho de WordPress.
