# Auditoría SEO + AEO (acceso de IA) de pintor-valencia.com — 28-10-2026

Complementa `ANALISIS-SEO-AEO-COMPETENCIA.md` y `MEDIDA-WEB-PROPIA.md` (27-10). Aquí se mide la web **publicada** (el `dist/` local es idéntico byte a byte a la portada en producción) con un script sobre las 517 páginas HTML y peticiones reales al servidor con el user-agent de cada bot de IA.

No se pudo medir Core Web Vitals: la API de PageSpeed agotó su cuota diaria. Repetir en https://pagespeed.web.dev/.

---

## 1. Resumen

| Área | Nota | Comentario |
|---|---|---|
| Acceso de crawlers IA | **9/10** | Todos los bots entran (200, sin bloqueos de Netlify), robots.txt explícito, llms.txt, HTML estático sin JS |
| SEO técnico | **8/10** | Canonical, sitemap con lastmod real, 301/410 correctos, HTTPS + HSTS, 0 enlaces rotos, 0 huérfanas |
| Datos estructurados | **5/10** | Están en todas las páginas, pero el negocio no tiene teléfono, dirección, horario, reseñas ni `sameAs`; la FAQ es la misma en grupos de ~89 páginas |
| Contenido para respuestas (AEO) | **4/10** | No hay frase-respuesta al principio, precios contradictorios, encabezados en mayúsculas con keyword repetida |
| Señales de confianza (E-E-A-T) | **2/10** | Sin teléfono, sin email (PENDIENTE), sin persona, sin obras, sin reseñas, sin fechas |

**Conclusión:** la puerta para la IA está abierta; lo que falla es **lo que encuentra al entrar**. Un asistente no recomienda a un negocio sin teléfono, sin dirección, sin reseñas y con precios que se contradicen. El mayor salto ya no es técnico: son datos del negocio y contenido que responda.

---

## 2. Acceso de crawlers de IA (comprobado en producción)

| Prueba | Resultado |
|---|---|
| Portada con UA de navegador, GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, CCBot | **200**, mismo HTML (72 KB), 0,4 s. Netlify no bloquea bots (Cloudflare sí lo haría por defecto) |
| `/robots.txt` | Permite a todos y nombra 16 bots de IA. Correcto |
| `/llms.txt` | 200, generado desde los datos. Correcto |
| `/sitemap.xml` | 200, 510 URLs, `lastmod` = fecha del último commit de cada página |
| `http://` y `www.` | 301 a `https://pintor-valencia.com/` |
| Sitemaps antiguos de Yoast | 301 al nuevo |
| Contenido sin JavaScript | Sí: todo el texto está en el HTML. Los bots de IA no ejecutan JS, así que esto es clave y está bien |

### Mejoras de acceso que faltan

1. **Bing Webmaster Tools sin verificar** (`verificaciones.bing` = PENDIENTE). Es lo más importante de esta sección: **ChatGPT Search y Copilot usan el índice de Bing**. Sin Bing, la web llega peor a ChatGPT aunque GPTBot pueda entrar.
2. **IndexNow**: avisar a Bing/Yandex en cada despliegue de las URLs cambiadas. En Netlify basta con un archivo de clave en `public/` y una llamada tras la build. Acelera que ChatGPT/Copilot vean los cambios.
3. **`llms.txt` sin datos**: solo es un índice de enlaces. Debería llevar los hechos que un asistente necesita para citar: zona, precios de referencia con fecha e IVA, plazos, teléfono, horario, garantía. Además, `/llms-full.txt` con el texto limpio de portada, precios, servicios principales y FAQ.
4. **Google-Extended no controla las AI Overviews** (las usa Googlebot). Está bien permitido, solo es para no esperar efectos de esa línea.
5. Opcional en robots.txt: nombrar también `Amazonbot` (Alexa/Rufus), `Applebot` y `cohere-ai`. Ya entran por `User-agent: *`; es solo explicitud.

---

## 3. SEO técnico y on-page (medido sobre 511 páginas indexables)

| Métrica | Valor | Estado |
|---|---:|---|
| Títulos > 60 caracteres | **445** (mediana 73, máx. 95) | Mal |
| Títulos duplicados | 0 | Bien |
| Descripciones > 160 caracteres | 38 | Regular |
| Descripciones duplicadas | 0 | Bien |
| Páginas sin exactamente un H1 | 1 (la verificación de Google, ignorable) | Bien |
| H1 en mayúsculas | 2: portada «PINTOR VALENCIA» y `/empresa/` | Mal en la portada |
| Canonical incorrecto | 0 | Bien |
| Enlaces internos rotos | 0 | Bien |
| Páginas huérfanas | 0 | Bien |
| Imágenes que faltan | 0 | Bien |
| Imágenes sin dimensiones | 10 de 8.475 | Bien |
| Imágenes con `alt=""` | 996 (2 por página: `presupuesto-de-pintor.png` y `alisado-de-paredes.jpg`) | Mejorable: son las mismas en 498 páginas, poner un alt descriptivo |
| Palabras en `<main>` | mín. 0 / mediana 1.211 / máx. 4.110 | Bien en volumen; el problema es que es repetido |
| `hreflang` | 0 | Correcto si solo hay español |
| Fechas visibles o `dateModified` | 0 páginas | Mal para AEO |
| HTML (mediana) | 35 KB | Bien |

### Problemas concretos de la portada (la palabra clave principal está en posición ~43)

- **Título**: «PINTOR VALENCIA - Pintor en Valencia - Pintores Valencia - Pintor» — repite «pintor» 4 veces, en mayúsculas, sin beneficio. Propuesta: `Pintor en Valencia | Presupuesto gratis en 24 h` (≈48 caracteres).
- **H1** «PINTOR VALENCIA» solo es la keyword. Propuesta: «Pintor en Valencia: pisos, casas, fachadas y comunidades».
- **Primer párrafo**: «Pintores de casas Valencia, locales, edificios y empresas» — no responde nada. Falta un bloque «En resumen» con qué, dónde, desde cuánto y cómo pedir presupuesto.
- **Primer H2** «Pintores». *(El «H2 vacío» de la primera versión de este informe era un falso positivo: un H2 con una etiqueta dentro.)*
- **Errata «PINTORES INDUTRIALES»** en la portada y en 155 páginas; «¿Estas buscando…?» sin tilde.
- Los precios salen como **H3** («Precio pintar una casa de 60 m2. 600 euros.»). *(La contradicción con «entre 300 y 900 €» ya se corrigió el 27-10 con `scripts/precios-mercado.mjs`.)*

### Contenido duplicado (ya detectado el 27-10, sigue igual)

3 × 79 páginas de escayola, pladur y fachadas iguales salvo la ciudad + grupos de 16 ciudades de pintor. Google indexa una por grupo; los LLM ven el mismo texto y no tienen motivo para citar una página concreta.

---

## 4. Datos estructurados (schema.org)

Hay en las 510 páginas: `HousePainter`, `BreadcrumbList`, `WebPage`, `FAQPage`, y `Service` en 503. JSON-LD válido en todas.

| Falta | Por qué importa |
|---|---|
| `telephone` | No hay teléfono **en ninguna parte de la web** (ni `tel:` ni en el schema). Para un negocio local es lo primero que buscan Google, el Local Pack y los asistentes que ofrecen «llamar» |
| `address` completa (`streetAddress`, `postalCode`) y `geo` | Sin NAP (nombre, dirección, teléfono) coherente con la Ficha de Google, la web no se asocia al negocio local |
| `sameAs` | Enlace a la Ficha de Google, Facebook, Instagram, Habitissimo… Es como los LLM confirman que el negocio existe |
| `openingHoursSpecification`, `priceRange`, `foundingDate` | Datos que los asistentes leen y repiten |
| `aggregateRating` / `review` | Solo con reseñas reales y comprobables |
| `WebPage.dateModified` | Ya se calcula la fecha para el sitemap: basta reutilizarla. Los LLM priorizan contenido con fecha |
| `Person` (autor/responsable) en `/empresa/` y `/precio/` | E-E-A-T |
| **FAQ**: 113 variantes, pero 4 grupos de 86-89 páginas con las mismas preguntas | Google ya no muestra FAQ enriquecida a este tipo de webs (desde 2023); el marcado no hace daño, pero el texto repetido sí resta. Cada página debería tener 3-5 preguntas propias |
| `Service` en `/precio/`, portada y `/servicios-pintura/` | `/precio/` es la página que más tráfico trae: merece `Service` + `Offer`/`PriceSpecification` con la tabla de precios |

---

## 5. Contenido para respuestas de IA (AEO)

Los asistentes extraen **frases autocontenidas con datos**. Patrón a aplicar en portada, `/precio/` y servicios principales:

1. **Primera frase = respuesta**: «Pintar un piso de 80 m² en Valencia cuesta entre X € y Y € con IVA (precios de octubre de 2026), en 2-3 días.»
2. **Tabla HTML** (no imagen) de precios por m² de vivienda y por concepto, con fecha e IVA indicados.
3. **H2/H3 en forma de pregunta** («¿Cuánto cobra un pintor por hora en Valencia?») seguidos de una respuesta de 40-60 palabras.
4. **«Actualizado: octubre 2026»** visible y en `dateModified`.
5. **Datos verificables**: años de experiencia, nº de obras, garantía, seguro de RC, zona real.
6. **Página de respuesta** «¿Cuánto cobra un pintor en Valencia?» (hora, día, m² de suelo vs. de pared). Ya estás en posición 8-11 para esas búsquedas: es el hueco con más retorno.

---

## 6. Plan priorizado

### Puedo hacerlo ya, sin datos del propietario

| # | Acción | Impacto | Esfuerzo |
|---|---|---|---|
| 1 | `dateModified` en el schema `WebPage` + «Actualizado» visible en `/precio/` y guías (reutiliza la fecha del sitemap) | Alto (AEO) | Bajo |
| 2 | IndexNow: archivo de clave + aviso tras despliegue | Medio-alto (ChatGPT/Copilot) | Bajo |
| 3 | `llms.txt` con sección «Datos clave» + `/llms-full.txt` con el texto limpio de las páginas principales | Medio | Bajo |
| 4 | Portada: título, H1, bloque «En resumen», quitar el H2 vacío, H2 con keyword *(pediste permiso para tocar títulos/H2 en el cuestionario)* | Alto | Bajo |
| 5 | Erratas «INDUTRIALES» / «Estas» en 155 páginas por regla | Bajo-medio | Bajo |
| 6 | `alt` descriptivo a las 2 imágenes repetidas (996 apariciones) | Bajo | Muy bajo |
| 7 | Títulos > 60 caracteres, por tandas, empezando por las páginas con impresiones | Medio | Bajo (script) |
| 8 | Página «¿Cuánto cobra un pintor en Valencia?» con tabla | Alto | Bajo |

### Necesita datos tuyos (bloquean lo que más mueve la aguja)

| # | Dato | Desbloquea |
|---|---|---|
| A | **Teléfono** y **email** | Botón de llamada, `telephone` en schema, llms.txt, Local Pack |
| B | **Verificación de Bing** (código `msvalidate.01`) | Índice de ChatGPT Search y Copilot |
| C | **Ficha de Google** (URL), nº de reseñas y nota | `sameAs`, `aggregateRating`, confianza |
| D | Dirección o zona base, horario | `address`, `geo`, `openingHours` |
| E | Precios reales con IVA (o elegir la referencia de mercado) | Tabla única y arreglo de 131 páginas |
| F | Persona responsable, años, garantía, seguro, 5-10 obras con localidad | E-E-A-T, página «Quiénes somos» |
| G | Decisión sobre las 3 × 79 páginas duplicadas: reescribir o `noindex` | Fin de la canibalización |

---

## 6 bis. Aplicado el 29-10-2026 (pendiente de publicar)

| # | Hecho | Dónde |
|---|---|---|
| 1 | `dateModified` en el schema `WebPage` (misma fecha que el `lastmod` del sitemap). **Sin fecha visible**: el propietario eligió precios «sin fechas» | `src/layouts/Base.astro` |
| 2 | IndexNow: clave en `public/5f91…8b6c.txt`; al final de `npm run build`, solo en producción de Netlify, se avisa de las URLs cuyo `lastmod` difiere del sitemap publicado | `scripts/indexnow.mjs`, `package.json` |
| 3 | `llms.txt` con «Datos clave» (zona, idiomas, tabla de precios) y enlace a `/llms-full.txt` (texto de 48 páginas principales, sin bloques repetidos, ~270 KB) | `src/pages/llms.txt.js`, `src/pages/llms-full.txt.js`, `PRECIOS` en `src/utils/negocio.js` |
| 4 | Portada: título, H1, entradilla con respuesta directa y precio, meta descripción, H2 «Pintores en Valencia» | `home.json` |
| 5 | Erratas: 247 «INDUTRIALES», 245 «¿Estas buscando» | `scripts/erratas.mjs` |
| 6 | `alt` en las 996 imágenes que lo tenían vacío | `scripts/erratas.mjs` |
| 7 | 445 títulos acortados a ≤ 60 caracteres (plantilla por familia + 34 escritos a mano) | `scripts/titulos-seo.mjs` |
| 8 | Página nueva `/cuanto-cobra-un-pintor/` (hora, día, m² de suelo frente a pared, tablas, FAQ propia), enlazada desde `/precio/` y `llms.txt` | `cuanto-cobra-un-pintor.json` |

Resultado del audit tras el cambio: 0 títulos > 60, 0 imágenes sin `alt`, 0 enlaces rotos. **Vigilar** en Search Console que `/cuanto-cobra-un-pintor/` no le quite a `/precio/` las consultas «cuánto cobra un pintor por hora»; si pasa, se fusiona con 301.

## 7. Cómo medir el efecto

- **Search Console**: posición de la portada para «pintor valencia» (hoy ~43) y clics de `/precio/`.
- **Bing Webmaster Tools**: una vez verificada, informe de URLs indexadas y la sección de «AI Performance»/Copilot si está disponible.
- **Referencias de IA**: en Analytics (`G-H4RG2R2Y4T`), filtrar tráfico de referencia de `chatgpt.com`, `perplexity.ai`, `copilot.microsoft.com`, `gemini.google.com`.
- **Logs de Netlify**: visitas de GPTBot, OAI-SearchBot, ClaudeBot y PerplexityBot (confirma que rastrean).
- **Prueba manual mensual**: preguntar a ChatGPT, Perplexity y Gemini «pintor en Valencia precio piso 80 m²» y anotar si citan la web.
