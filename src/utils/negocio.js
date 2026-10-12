/* Datos del negocio que comparten el schema (Base.astro), el sitemap y
   llms.txt. Todo se deduce de site.json para no mantener listas aparte. */
import { execSync } from 'node:child_process';
import site from '../data/site.json';

/* Un valor de site.json solo se publica si ya está rellenado. */
export const puesta = (v) => Boolean(v) && !String(v).startsWith('PENDIENTE');

const hijosSinUrl = (nav) =>
  (site[nav] ?? []).filter((e) => !e.url && e.hijos).flatMap((e) => e.hijos);

/* Nombre limpio de cada municipio, sacado del menú de fachadas porque es
   el único con un patrón fijo ("Fachadas en X"). Clave: el slug base. */
export const MUNICIPIOS = Object.fromEntries(
  hijosSinUrl('navegacionFachada').map((h) => [
    h.url.replace(/^\/fachadas-|\/$/g, ''),
    h.texto.replace(/^Fachadas en /, ''),
  ])
);

/* La página de pintores de cada municipio no sigue un patrón fijo
   (/alzira/, /pintores-xativa/, /pintor-oliva/...): se toma del menú
   "Zonas". Clave: el slug base; valor: la URL real. */
export const PAGINA_PINTORES = Object.fromEntries(
  hijosSinUrl('navegacion').map((h) => [
    h.url.replace(/^\/|\/$/g, '').replace(/^(pintores-en-|pintores-|pintor-)/, ''),
    h.url,
  ])
);
const PINTORES_POR_URL = Object.fromEntries(
  Object.entries(PAGINA_PINTORES).map(([slug, url]) => [url, slug])
);

/* Las familias de páginas por municipio y el servicio que ofrecen. */
const SERVICIO_PINTURA = 'Pintura de viviendas, locales y comunidades';
const FAMILIAS = [
  { prefijo: 'fachadas-', servicio: 'Pintura y rehabilitación de fachadas' },
  { prefijo: 'escayolista-', servicio: 'Escayola, molduras y falsos techos' },
  { prefijo: 'pladur-', servicio: 'Tabiques y techos de pladur' },
];

/* Si la URL es de una página local devuelve { municipio, servicio }. */
export function paginaLocal(url) {
  const deZona = MUNICIPIOS[PINTORES_POR_URL[url]];
  if (deZona) return { municipio: deZona, servicio: SERVICIO_PINTURA };
  const slug = url.replace(/^\/|\/$/g, '');
  for (const f of FAMILIAS) {
    if (!slug.startsWith(f.prefijo)) continue;
    const municipio = MUNICIPIOS[slug.slice(f.prefijo.length)];
    if (municipio) return { municipio, servicio: f.servicio };
  }
  return null;
}

/* Servicios del menú principal (/casa/, /gotele/...). */
export const SERVICIOS = site.navegacion.find((e) => e.url === '/servicios-pintura/')?.hijos ?? [];

/* Fecha real del último commit que tocó cada JSON de src/content/pages/.
   Una sola llamada a git para todo el sitio. Si no hay git o el clon es
   superficial (todas las fechas serían la misma), devuelve un mapa vacío
   y el sitemap omite <lastmod>: mejor sin fecha que con una falsa. */
let fechas;
export function fechaModificacion(archivo) {
  if (!fechas) {
    fechas = new Map();
    try {
      const opts = { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 };
      if (execSync('git rev-parse --is-shallow-repository', opts).trim() !== 'true') {
        const log = execSync('git log --format=@%cs --name-only -- src/content/pages', opts);
        let fecha = null;
        for (const linea of log.split('\n')) {
          if (linea.startsWith('@')) fecha = linea.slice(1);
          else if (linea && !fechas.has(linea.split('/').pop())) fechas.set(linea.split('/').pop(), fecha);
        }
      }
    } catch {
      /* sin git: se queda vacío */
    }
  }
  return fechas.get(archivo) ?? null;
}
