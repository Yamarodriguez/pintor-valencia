import site from '../data/site.json';
import { fechaModificacion } from '../utils/negocio.js';

const modulos = import.meta.glob('../content/pages/*.json', { eager: true });

/* <lastmod> es la fecha del último commit que cambió el JSON de la
   página, no la de la build: si cambiara en cada despliegue, Google y
   los rastreadores de IA dejarían de fiarse de ella. */
const paginas = new Map();
for (const [ruta, m] of Object.entries(modulos)) {
  const p = m.default ?? m;
  if (!p.url || p.noindex || paginas.has(p.url)) continue;
  paginas.set(p.url, fechaModificacion(ruta.split('/').pop()));
}
const urls = [...paginas.keys()].sort();

export function GET() {
  const cuerpo = urls.map((u) => {
    const fecha = paginas.get(u);
    return `  <url>
    <loc>${site.dominio}${u}</loc>${fecha ? `
    <lastmod>${fecha}</lastmod>` : ''}
  </url>`;
  }).join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cuerpo}
</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
}
