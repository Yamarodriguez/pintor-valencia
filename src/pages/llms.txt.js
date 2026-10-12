/* /llms.txt: índice en Markdown para asistentes de IA (formato de
   llmstxt.org). Se genera en cada build desde site.json y los JSON de
   páginas, así que un servicio o municipio nuevo aparece solo. */
import site from '../data/site.json';
import { puesta, MUNICIPIOS, PAGINA_PINTORES, SERVICIOS } from '../utils/negocio.js';

const modulos = import.meta.glob('../content/pages/*.json', { eager: true });
const PAGINAS = Object.fromEntries(
  Object.values(modulos).map((m) => m.default ?? m).map((p) => [p.url, p])
);

const d = site.dominio;
/* El H1 describe mejor la página que el meta título heredado de Yoast.
   Los H1 en mayúsculas son solo keyword ("PINTOR VALENCIA") y se omiten. */
const enlace = (url, texto, nota) => {
  const h1 = PAGINAS[url]?.h1;
  const util = h1 && h1 !== texto && h1 !== h1.toUpperCase() ? h1 : null;
  const extra = nota ?? util;
  return `- [${texto}](${d}${url})${extra ? `: ${extra}` : ''}`;
};

export function GET() {
  const municipios = Object.entries(MUNICIPIOS)
    .sort((a, b) => a[1].localeCompare(b[1], 'es'))
    .map(([slug, nombre]) => `[${nombre}](${d}${PAGINA_PINTORES[slug] ?? `/fachadas-${slug}/`})`)
    .join(', ');

  const contacto = [
    `- [Pedir presupuesto gratis](${d}/presupuesto/): formulario web, respuesta sin compromiso`,
    `- [Contacto](${d}/contacto/)`,
    puesta(site.email) && `- Email: ${site.email}`,
    puesta(site.contacto?.telefono) && `- Teléfono: ${site.contacto.telefono}`,
  ].filter(Boolean);

  const texto = `# ${site.nombre}

> Empresa de pintores en Valencia y su provincia. Pintura de pisos, casas, locales y comunidades, fachadas, escayola y pladur, con presupuesto gratuito y sin compromiso.

Trabajamos en Valencia capital (por barrios) y en ${Object.keys(MUNICIPIOS).length} municipios y barrios de la provincia. Cada servicio tiene una página general y una página por municipio.

## Empresa y contacto

${enlace('/', 'Inicio')}
${enlace('/empresa/', 'Empresa')}
${enlace('/precio/', 'Precios', 'precios orientativos de pintura por metro cuadrado y por tamaño de vivienda')}
${contacto.join('\n')}

## Servicios de pintura

${enlace('/servicios-pintura/', 'Todos los servicios')}
${SERVICIOS.map((s) => enlace(s.url, s.texto)).join('\n')}

## Fachadas, escayola y pladur

${enlace('/pintores-de-fachadas/', 'Pintores de fachadas')}
${enlace('/escayolista/', 'Escayolista')}
${enlace('/pladur/', 'Pladur')}

## Zonas de trabajo

Pintores por municipio: ${municipios}.

Las mismas zonas tienen página de fachadas, escayola y pladur con estas URL:
- ${d}/fachadas-{municipio}/
- ${d}/escayolista-{municipio}/
- ${d}/pladur-{municipio}/

## Optional

${site.pie.enlaces.map((e) => `- [${e.texto}](${d}${e.url})`).join('\n')}
- [Mapa del sitio](${d}/sitemap.xml)
`;

  return new Response(texto, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
