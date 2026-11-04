# Estudio SEO de pintores en las 10 ciudades más pobladas de España (04-11-2026)

Objetivo: copiar lo que funciona en el sector y aplicarlo a pintor-valencia.com para subir en Google. Los datos de cada web están en `competencia-10-ciudades.csv`.

## 1. Qué mide este estudio y qué no

**Esto no es el top 8 real de Google.** Google y Bing están bloqueados en el navegador de esta sesión, y la herramienta de búsqueda da resultados de EE. UU. mezclados con historia del arte y hoteles.

| | Pedido | Hecho |
|---|---|---|
| Búsquedas | 4 variantes × 10 ciudades | Se lanzaron las 40, pero sin orden fiable. La lista de webs salió de 10 búsquedas comerciales («empresa de pintores en [ciudad] pintar piso presupuesto gratis») |
| Webs | 8 por búsqueda | 74 fichas de empresa candidatas (5-10 por ciudad), más portales. Se pudieron leer **65 fichas de 64 webs distintas** (pintorcasas.es sale en dos ciudades), 6 páginas de portales y tu web: 369 páginas. Otras 9 candidatas no respondieron |
| Orden de ranking | Sí | **No medido.** Saber quién va primero y por qué requiere la página real de Google |

Tampoco se han medido los **enlaces externos** ni la **Ficha de Google** (reseñas y mapa). Son los factores que suelen pesar más en una búsqueda local, y deciden quién sale en el mapa de arriba. Por tanto, ningún dato de aquí garantiza la posición 1: el estudio dice qué hacen los competidores, no qué les hace ganar.

Los datos de Search Console son del export del 31-08-2026, anterior a la migración a Astro.

## 2. Tu web frente a la muestra

| Métrica (portada o página de entrada) | Mediana competencia | Tu web | Lectura |
|---|---:|---:|---|
| Páginas en el sitemap | 39 | 510 | Mucho volumen, pero casi todo repetido |
| Palabras | 1.352 | 3.190 | Sobra longitud |
| H2 / H3 | 7 / 10 | 23 / 60 | Estructura demasiado fragmentada |
| Entradas principales del menú | 5 | 8 antes, **6 ahora** | Corregido |
| Enlaces por página en el menú | casi sin desplegables | 165 antes, **45 ahora** | Corregido |
| Teléfono clicable | 65 % | **No** | Lo que más te separa de ellos |
| WhatsApp | 51 % | **No** | Igual |
| Formulario en la página | 58 % | **No** en la portada | Fácil de resolver |
| Mapa | 31 % | Sí | Bien |
| Precios en euros | 46 % | Sí | Bien |
| Tabla HTML de precios | 14 % en entrada | **No** | Hueco barato de ocupar |
| Reseñas u opiniones visibles | 55 % | **No** | Necesita datos reales |
| Años de experiencia | 48 % | **No** | Necesita datos reales |
| Imágenes en WebP/AVIF | 15 % | **0 %** | Mejora técnica pendiente |
| `llms.txt` | 40 % | Sí | Bien |

Tres webs de cada cinco muestran teléfono y una de cada dos WhatsApp. Tú no tienes ninguno de los dos, y tampoco nombre, reseñas ni años de experiencia. **Este es el mayor freno, no el contenido.**

## 3. Patrones que se repiten

### Títulos
40 de 64 usan «en + ciudad». Casi nadie usa la keyword exacta sola: añaden presupuesto (17), precio (12) o gratis (12). Las fórmulas más claras:

- `Pintores en Valencia ⭐ 4,8 · 289 Reseñas | Pinta Tu Piso`: nota real en el título.
- `Pintores en Madrid | Pinta tu piso desde 500€`: precio de entrada.
- `Precio Pintar Piso Valencia 2026 | Desde 590 €-Pintores10`: año y precio en la página de precios.

### H1
Corto y directo: «Pintores en Madrid», «Pintores Barcelona», «Pintores en Valencia: calidad, rapidez y garantía». Tus zonas todavía usan mayúsculas tipo «PINTOR TORRENT: Tus Pintores en Torrente».

### H2 y H3: el guion de la página
Presencia en las 64 páginas de entrada:

| Bloque | Webs |
|---|---:|
| Preguntas frecuentes o H2 en pregunta | 51 |
| Precio y presupuesto | 50 |
| Servicios | 46 |
| Empresa y experiencia | 37 |
| Por qué elegirnos | 36 |
| Trabajos y antes/después | 27 |
| Zonas | 27 |
| Opiniones | 24 |
| Garantía | 23 |
| Proceso | 16 |

Orden recomendado para tu portada: entrada con formulario → servicios → precios con tabla → cómo trabajamos → obras reales → opiniones → zonas → preguntas.

### Menú
Lo habitual: Inicio, Servicios, Precios, Trabajos, Opiniones, Empresa/Quiénes somos y Presupuesto como botón. Destaca que **Opiniones y Trabajos aparecen como entradas de menú**: es una señal de confianza. Tú todavía no puedes tenerlas porque faltan esos contenidos.

### URLs e interlinking

| Web | Modelo | Qué copiar |
|---|---|---|
| **barnapintores.es** | `/pintores/eixample/pintar-piso`, `/precios/pintar-comunidad-barcelona` | **El mejor modelo.** La portada enlaza obras reales («Eixample, piso 95 m²») a su página de zona y servicio, con precio y tabla propios |
| pintoresvalencia10.com | `/precio-pintar-piso-valencia/`: 1.739 palabras, 2 tablas, 15 preguntas | Tu rival directo en precios |
| mirefugio.es | `/precios-presupuestos/`, `/problemas-soluciones/`, `/tipos-de-pintura/` | Guías agrupadas por tema |
| pintores-valencia.com | `/blog/gotele/cuanto-cuesta-quitar-gotele/` | Un tema, varias guías enlazadas |
| pintoresenmallorca.es | `/palma-de-mallorca/pintor-de-pisos/` | Cada servicio con precio propio por ciudad |
| decopintoreslevante.es | 7 servicios × municipio | **Evitar el abuso:** es tu mismo problema de páginas repetidas |

Mediana de enlaces dentro del contenido: 9 destinos distintos en la entrada. El enlace bueno sale del texto o de una obra, y con anclas descriptivas.

### Imágenes
- 87 % tiene `alt`, y 32 % incluye términos del sector. Solo 20 % nombra la ciudad.
- 28 % lleva keyword en el archivo y 17 % la ciudad. Solo 6 % son nombres genéricos tipo `IMG_1234`.
- Las mejores describen la foto: `caso-eixample-2026` con «Pintar piso 95m² en Eixample, Barcelona».
- Las tuyas tienen buen nombre, pero el `alt` es flojo: `empresa-de- pintores`, `Pintor`. Ninguno nombra un lugar y tienen pinta de foto de archivo.

### Datos estructurados
Lo más usado en las 65 webs: Organization y WebSite, BreadcrumbList (28), LocalBusiness (20) y HousePainter (12), FAQPage (19), Service (18), AggregateRating (14). Tu marcado ya está bien, salvo teléfono, dirección completa y `AggregateRating`, que dependen de datos reales. No se debe marcar ninguna nota inventada.

### Lo que hacen mal (y aprovechas)
- **Solo 14 % tiene tabla de precios en la entrada**, y varias páginas de precios tienen menos de 500 palabras.
- Solo 2 de 65 nombran escayola y 10 pladur, servicios que tú ya tienes.
- Casi nadie explica la diferencia entre m² de suelo y m² de pared.

## 4. Search Console: dónde está tu oportunidad

| Grupo de búsquedas | Impresiones | Clics | Posición media |
|---|---:|---:|---:|
| Municipios y otros | 54.140 | 29 | 37,3 |
| Precio | 49.995 | 36 | 33,2 |
| Genérico Valencia | 25.341 | 56 | 29,9 |
| Industrial y empresas | 18.199 | 4 | 40,6 |
| Genérico sin ciudad | 9.424 | 5 | 35,8 |
| Fachadas | 6.772 | 4 | 47,6 |

«Pintor en Valencia» (3.120 impresiones) estaba en la 23, «pintores en valencia» (3.414) en la 33 y «pintor valencia» (3.010) en la 19. Las más cercanas al top 10 son las de precio: «cuanto cobra un pintor por hora» 8,5, «por día» 9,3, «precio pintar piso 90 m2 valencia» 9,8.

## 5. Estructura aplicada (sin publicar)

No se ha cambiado ninguna URL, título ni H1.

```
Menú (el mismo en toda la web)
├── Servicios → 4 columnas
│   ├── Viviendas: pisos, casas y chalets, interiores, paredes y techos, particulares, baños
│   ├── Edificios y empresas: comunidades, fachadas, exteriores, empresas, industrial, epoxi
│   ├── Acabados: quitar gotelé, alisado, lacados, microcemento, decorativa, papel, barnizado
│   └── Reparación y especialidades: humedades, impermeabilización, grietas, pladur, escayola, piscinas, muebles
├── Precios → precios, cuánto cobra un pintor, pintores baratos
├── Zonas → 8 municipios + hub /zonas/
├── Empresa
├── Contacto
└── [Presupuesto gratis] (botón)
```

| Página | Interlinking nuevo |
|---|---|
| Zona (460 páginas) | «Más servicios en X» (sus otras 3 familias + precios) y «Pintores cerca de X» (6 de la misma comarca, de forma circular) |
| Servicio | Los demás de su grupo + precios + todos los servicios |
| `/zonas/` (nueva) | 115 zonas en 8 comarcas |
| Índices de fachadas, escayola y pladur | Sus 115 zonas por comarca |
| `/servicios-pintura/` | 42 servicios por grupos (pintores baratos está en Precios) |
| Pie | 4 columnas de enlaces + legales |

| Comprobación sobre la build | Antes | Después |
|---|---:|---:|
| Enlaces del menú por página | 165 | **45** |
| Enlaces internos salientes (mediana) | 167 | **57** |
| Enlaces rotos | 0 | **0** |
| Páginas huérfanas | 0 | **0** |
| Clics máximos desde la portada | 2 | **2** |
| Enlaces entrantes por página de zona | 116 | 10 (repartidos por igual) |

**Riesgo que debes conocer:** cada zona pasa de 116 a unos 10 enlaces entrantes. Es deliberado, porque ahora son enlaces con sentido geográfico y más autoridad para las páginas importantes. Aun así, hay que comparar en Search Console a las 4-6 semanas.

**Pendiente:** `src/components/Migas.astro` está marcado como solo lectura, y por eso las migas de las zonas no muestran «Zonas». No he quitado esa protección.

## 6. Plan priorizado

### A. Necesita tus datos (lo que más puede mover)
| # | Acción | Por qué |
|---|---|---|
| 1 | **Teléfono y WhatsApp** visibles en toda la web | 65 % y 51 % de la muestra los tienen |
| 2 | **Ficha de Google** con categoría, zona, fotos y reseñas | Decide quién sale en el mapa |
| 3 | **5-10 obras reales** con barrio, m², antes/después y fotos propias | Permite copiar el modelo Barna Pintores |
| 4 | **Opiniones reales**, persona responsable, años y garantía | Da pie a las entradas de menú y a la nota en el título |
| 5 | **Enlaces externos locales**: asociaciones, proveedores, comunidades, prensa local | No medido aquí, pero suele ser decisivo |

### B. Lo puedo hacer yo
| # | Acción | Impacto | Esfuerzo |
|---|---|---|---|
| 6 | **Páginas de precio por servicio**: `/precio-pintar-piso-valencia/`, gotelé, fachada, comunidad, con tablas y preguntas | Alto | Medio |
| 7 | **Portada** reordenada con el guion del punto 3, formulario y tabla | Alto | Medio |
| 8 | **Reescribir las 20 zonas con más impresiones** (Torrent, Llíria, Xàtiva, Gandia, Sagunto…) con texto propio | Alto | Alto |
| 9 | H1 de zonas sin mayúsculas: «Pintores en Torrent» | Medio | Bajo |
| 10 | Guías por tema: precios, gotelé, fachadas, humedades | Medio-alto | Alto |
| 11 | `alt` descriptivos y conversión a WebP, sin renombrar las indexadas | Medio | Medio |

### C. Decisión tuya
**12. Las 345 páginas de fachadas, escayola y pladur por municipio** son casi iguales. Se pueden reescribir las que tengan tráfico y dejar sin indexar el resto, pero conviene mirar antes su tráfico en un export reciente.

## 7. Para tener el estudio completo

1. **Top 8 real:** activa el acceso a Google en el navegador o usa Claude en Chrome, o exporta las 40 búsquedas desde una herramienta SEO. Con esa lista se repite el análisis con el mismo script.
2. **Enlaces externos:** Ahrefs necesita autorización mediante `/mcp`, desde un terminal `claude`.
3. **Search Console:** un export actual, posterior a la migración.
