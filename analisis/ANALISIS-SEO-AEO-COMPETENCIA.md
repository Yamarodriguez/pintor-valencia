# Análisis SEO y AEO frente a la competencia: «pintor valencia» (27-10-2026)

Base: la medida de la web propia (`MEDIDA-WEB-PROPIA.md`) y la lectura de 9 competidores hecha por un subagente.

**Límites de la lectura:** el buscador que usó el subagente no reproduce la página de resultados real de Google.es (ni el orden, ni la respuesta de IA, ni las «Otras preguntas»), y tampoco se pudo leer el schema de los competidores. Antes de dar por buena la lista, hay que mirar la página de resultados a mano en Google.es desde Valencia, en modo incógnito.

## 1. Quién compite

| Tipo | Webs | Qué les hace ganar |
|---|---|---|
| Portales | cronoshare.com, habitissimo.es, trustlocal.es | Guías de precio con tablas, fecha de actualización y autor, reseñas con número y nota, una página por municipio |
| Empresas locales | tuspintoresvalencia.com, decopintoresvalencia.es, pintoresvalencia10.com, pintoresolmo.es | Garantía por escrito, presupuesto en 24 h, una persona con nombre detrás, llms.txt (Deco y Olmo) |
| Dominios con la palabra clave | pintores-valencia.com, pintoresvalencia.eu | Dominio exacto, tabla de tarifas, blog de gotelé |

«Pintor valencia» a secas mezcla resultados de pintores artistas (historia del arte). La intención de contratar se ve más clara en «pintores valencia», «pintores en valencia precios» y «precio pintar piso valencia», donde mandan Cronoshare y Habitissimo.

## 2. Lo que tienes mejor

1. **Tamaño y cobertura local**: más de 150 localidades. El mejor local, tuspintoresvalencia, tiene 24 y los demás, entre 0 y 6.
2. **AEO técnico**: `llms.txt`, bots de IA permitidos por nombre y marcado `HousePainter` y `Service`. Ningún competidor nombra bots de IA y solo 2 tienen llms.txt.
3. **Ya te encuentran por preguntas de precio**: «cuánto cobra un pintor por hora» está en la posición 8,5 y «precio pintar piso 90 m2 valencia» en la 9,8.
4. **Servicios que los locales casi no tocan**: escayola, pladur, piscinas, muebles y microcemento.

## 3. Lo que te frena

| # | Problema | Efecto |
|---|---|---|
| F1 | 3 × 79 páginas de escayola, pladur y fachadas iguales salvo la ciudad, y grupos de 16 ciudades de pintor iguales | Google indexa una de cada grupo y las demás compiten entre sí |
| F2 | Precios contradictorios en 131 páginas (600 € por 60 m² y, en la misma página, «entre 300 y 900 €»), sin fecha ni IVA | La IA no cita una cifra que se contradice, y resta confianza |
| F3 | La portada (posición 43) no responde: el primer h2 es «Pintores», no hay una primera frase con qué haces, dónde y desde cuánto, y el título repite «pintor» 4 veces | Pierde frente a `/precio/` en su propia palabra clave |
| F4 | Sin señales de confianza: nadie con nombre, ni obras con localidad, reseñas con número, garantía escrita o email (sigue en PENDIENTE) | Es lo primero que muestran los que están arriba |
| F5 | FAQ genérica, la misma en casi todas las páginas y en «usted» | No aporta nada propio a cada página |
| F6 | 445 títulos de más de 60 caracteres; erratas en mayúsculas («PINTORES INDUTRIALES» en 155 páginas) | Se cortan en Google y parecen descuidados |
| F7 | Párrafos de plantilla repetidos en 230-260 páginas | Diluyen lo que tiene de propio cada página |

## 4. Huecos priorizados

| Prio. | Acción | Impacto | Esfuerzo | Quién |
|---|---|---|---|---|
| 1 | **Una sola referencia de precios** (tabla con fecha, IVA sí/no y qué incluye) en `/precio/` y en la portada; las 131 páginas, cambiadas a esa referencia con un script | Alto | Medio | Claude, **con tus precios o con la opción de mercado** |
| 2 | **Portada**: recuadro «En resumen» con respuesta directa, h2 con la palabra clave, título de 45-60 caracteres y FAQ propia (precio, plazo, zona, garantía) | Alto | Bajo | Claude, con permiso para tocar título y h2 |
| 3 | **Página de respuesta «¿Cuánto cobra un pintor en Valencia?»** por hora, día y m² (suelo frente a pared), con tabla. Ya tienes las posiciones 8-11 | Alto | Bajo | Claude |
| 4 | **Diferenciar las páginas de ciudad**: primero las 40 que más impresiones traen (Torrent, Gandia, Llíria, Picassent, Xàtiva…), con texto propio bajo cada h2, barrios o zonas, tipo de vivienda y FAQ local. Las de escayola, pladur y fachadas sin tráfico, decidir si se diferencian o se dejan sin indexar | Alto | Alto | Claude por tandas; tú decides lo de las que no indexar |
| 5 | **Confianza**: página «Quiénes somos» con persona y foto, obras reales con localidad, número de reseñas de Google y garantía | Alto | Medio | **Tú** das los datos; Claude lo monta |
| 6 | Ampliaciones SEO de los servicios principales (casa, piso, fachadas, gotelé, alisado, lacado, pladur, escayola, piscinas): 800-1.100 palabras con tipos, tabla, qué revisar, h3 en pregunta y FAQ | Medio-alto | Medio | Claude (necesita el motor de `ampliacion`) |
| 7 | Títulos y descripciones: los 445 largos, por tandas, empezando por las páginas con impresiones | Medio | Bajo (script) | Claude, con permiso |
| 8 | Erratas de los encabezados («INDUTRIALES», «Estas») por un fichero de reglas | Bajo-medio | Bajo | Claude, con permiso |
| 9 | Fecha «Actualizado: mes y año» y autor en `/precio/` y en las guías | Medio | Bajo | Claude; el autor lo das tú |

## 5. Recomendaciones AEO (para que la IA te cite)

- **Primera frase = respuesta**: «Pintar un piso de 80 m² en Valencia cuesta entre X y Y € (IVA incluido, octubre de 2026)». Solo pintoresvalencia10 lo hace, y nadie pone el IVA y la fecha juntos.
- **Tablas** de precio por tamaño de vivienda (60/80/90/100/120 m²) y por concepto (gotelé, alisado, lacado, fachada, pladur). Escayola por m²: nadie publica precio, así que es un hueco.
- **Explicar la diferencia entre m² de suelo y m² de pared**: es lo que explica por qué los portales dicen 4-8 €/m² y las empresas 8-15 €/m². Nadie lo explica.
- Marcado `FAQPage` solo con las preguntas propias de cada página, y `AggregateRating` solo si hay reseñas reales que se puedan comprobar.
- Mantener llms.txt, añadir la tabla de precios y las páginas de respuesta, y la fecha en el mapa del sitio.

## 6. Estructura propuesta (silos)

```
/                       Pintor Valencia (portada: respuesta, precios resumidos, servicios, zonas)
├── /precio/            Precios: referencia única con tabla, fecha e IVA
│   └── cuánto cobra un pintor (hora, día, m²)
├── servicios de pintura   casa, piso, interiores, fachadas, comunidades, empresas, piscinas, muebles, lacados
├── acabados y reformas    gotelé, alisado, microcemento, pladur, escayola, impermeabilizaciones
└── zonas
    ├── barrios de Valencia (Benimaclet, Cabanyal, Campanar…)
    └── municipios → enlazan a su escayola, pladur y fachadas solo si esa página tiene texto propio
```

## 7. Qué hago yo, qué necesita permiso, qué necesita datos

| Lo hago yo sin más | Necesita tu permiso | Necesita tus datos |
|---|---|---|
| Medidas y scripts de control; página «cuánto cobra un pintor»; ampliaciones al final de las páginas; FAQ nuevas | Cambiar títulos y descripciones; renombrar h2 de la portada; corregir erratas del texto original; cambiar los precios de 131 páginas; dejar sin indexar páginas de ciudad | Precios reales con IVA; plazos; quién hay detrás; garantía; obras; perfil de Google y reseñas; email |
