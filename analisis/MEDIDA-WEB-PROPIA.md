# Medida de pintor-valencia.com (27-10-2026)

Palabra clave principal: **pintor valencia** (variantes: pintores valencia, pintor en valencia, pintores en valencia, pintores en valencia precios).

Datos sacados con un script sobre los 514 JSON de `src/content/pages/` (detalle por página en `analisis/medida-paginas.json`) y del export de Search Console del 31-08-2026 (16 meses).

## 1. Cómo está hoy en Google

| Consulta | Clics | Impresiones | Posición media |
|---|---:|---:|---:|
| pintor valencia | 40 | 3.010 | 18,9 |
| pintor en valencia | 2 | 3.120 | 23,4 |
| pintores valencia | 9 | 2.673 | 24,2 |
| pintores en valencia | 1 | 3.414 | 32,7 |
| pintores en valencia precios | 2 | 555 | 21,3 |
| cuanto cobra un pintor por hora | 9 | 3.107 | 8,5 |
| cuanto cobra un pintor por m2 | 1 | 901 | 11,2 |
| precio pintar piso 90 m2 valencia | 2 | 538 | 9,8 |

- En total: 1.704 clics y 444.016 impresiones en 123 páginas.
- `/precio/` trae más que la portada: 195 clics frente a 113. La portada está en la posición media **43**: con la palabra clave principal no llega a la segunda página de Google.
- Donde mejor va es en las preguntas de precio («cuánto cobra un pintor»), con posiciones de 8 a 11. Ese es el hueco de respuesta que hay que reforzar.
- Las páginas de ciudad pequeña (Turís, Rafelbunyol, Ayora) tienen el CTR más alto (3-4,6 %).

## 2. Lo que hay en la web

| Familia | Páginas | Palabras (mín / mediana / máx) | Casi iguales entre sí |
|---|---:|---|---|
| Pintor (portada, servicios y ciudades) | 167 | 0 / 2.947 / 6.452 | grupos de 16 ciudades con el mismo texto |
| Escayolista por ciudad | 116 | 1.402 / 1.402 / 2.039 | 79 páginas idénticas salvo la ciudad |
| Pladur por ciudad | 116 | 1.350 / 1.350 / 1.697 | 79 páginas idénticas salvo la ciudad |
| Fachadas por ciudad | 115 | 1.264 / 1.264 / 1.336 | 79 páginas idénticas salvo la ciudad |

Las familias de escayola, pladur y fachadas no salen en el export de Search Console porque se crearon después.

## 3. Problemas encontrados

1. **Páginas que compiten entre sí.** 3 × 79 páginas de ciudad de escayola, pladur y fachadas tienen el mismo texto con la ciudad cambiada, y hay grupos de hasta 16 ciudades de pintor también iguales. Google suele indexar solo una de cada grupo.
2. **Precios que salen en 131 páginas con cifras distintas a la vez**: «60 m² 600 euros», «90 m² 900 euros», «100 m² 1.200 euros», «120 m² 1.500 euros», y en la misma página «puede oscilar entre 300 y 900 euros». La portada los tiene como h3. Además, 9 páginas dicen «20 €/hora (15-40 €)». Hay que dejar **una sola referencia de precios** con fecha e IVA.
3. **La frase «El importe final depende de cada trabajo y se cierra tras la visita» se repite en 260 páginas**, y otros párrafos de la plantilla, en 230-252 (relleno común).
4. **Títulos SEO**: 445 de 514 pasan de 60 caracteres, y 497 llevan el separador de Yoast (el motor lo cambia por «-»). Ejemplo de la portada: «PINTOR VALENCIA - Pintor en Valencia - Pintores Valencia - Pintor» (repite la palabra clave 4 veces). 54 descripciones pasan de 158 caracteres.
5. **Encabezados en mayúsculas y con erratas**: «PINTORES INDUTRIALES» (falta una s) aparece en 155 páginas; «¿Estas buscando…» sin tilde.
6. **La portada no responde a la búsqueda**: el primer h2 es «Pintores» y no hay una frase de respuesta directa (qué haces, dónde y desde cuánto) al principio.
7. **FAQ genérica, igual en casi todas las páginas** y escrita en «usted» («puede contactar con nosotros»). `/precio/` junta 14 preguntas, algunas duplicadas y con un espacio antes del «?».
8. **Faltan datos del negocio**: el email del `site.json` sigue en `PENDIENTE`; no hay razón social, quién trabaja, obras con localidad ni reseñas.

## 4. Lo que ya está bien

- Web estática en Astro, rápida, con migas de pan, `llms.txt`, bots de IA permitidos en `robots.txt`, marcado `HousePainter` y `Service` y fechas `lastmod` reales.
- Muchísima cobertura local: más de 150 localidades y barrios.
- `/precio/` ya tiene un bloque «¿Cuánto cobra un pintor en Valencia?» con tarifas orientativas.
