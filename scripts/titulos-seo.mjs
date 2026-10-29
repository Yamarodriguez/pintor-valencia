// Acorta los meta títulos de más de 60 caracteres (se cortaban en Google y repetían la
// palabra clave: «Pintor X - Pintores - Empresa de pintores X»).
// Páginas por municipio: plantilla por familia, de la más larga a la más corta, hasta
// que una quepa en 60. Resto de páginas: título escrito a mano en MANUALES.
// Uso: node scripts/titulos-seo.mjs        (en seco: recuento y ejemplos)
//      node scripts/titulos-seo.mjs --aplicar
// Se puede ejecutar dos veces: la segunda pasada da 0 cambios.
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/content/pages';
const APLICAR = process.argv.includes('--aplicar');
const MAX = 60;

// Misma deducción que src/utils/negocio.js (no se importa: allí el JSON lo carga Vite).
const site = JSON.parse(fs.readFileSync('src/data/site.json', 'utf8'));
const hijosSinUrl = (nav) => (site[nav] ?? []).filter((e) => !e.url && e.hijos).flatMap((e) => e.hijos);
const MUNICIPIOS = Object.fromEntries(
  hijosSinUrl('navegacionFachada').map((h) => [h.url.replace(/^\/fachadas-|\/$/g, ''), h.texto.replace(/^Fachadas en /, '')])
);
const ZONA_POR_URL = Object.fromEntries(
  hijosSinUrl('navegacion').map((h) => [h.url, h.url.replace(/^\/|\/$/g, '').replace(/^(pintores-en-|pintores-|pintor-)/, '')])
);

const PLANTILLAS = {
  pintor: (m) => [`Pintor en ${m} | Pintores de pisos, casas y fachadas`, `Pintor en ${m} | Pintores de pisos y casas`, `Pintor en ${m} | Pintores`],
  'fachadas-': (m) => [`Pintor de fachadas en ${m} | Pintar y rehabilitar`, `Pintor de fachadas en ${m} | Presupuesto gratis`, `Pintor de fachadas en ${m}`],
  'escayolista-': (m) => [`Escayolista en ${m} | Techos y molduras de escayola`, `Escayolista en ${m} | Techos de escayola`, `Escayolista en ${m}`],
  'pladur-': (m) => [`Pladur en ${m} | Tabiques, techos y trasdosados`, `Pladur en ${m} | Tabiques y techos`, `Pladur en ${m}`],
};

const MANUALES = {
  '/': 'Pintor en Valencia | Pintores de pisos, casas y fachadas',
  '/alisado-de-paredes/': 'Alisado de paredes en Valencia | Pintor Valencia',
  '/barnizado-de-madera/': 'Barnizado de madera en Valencia | Puertas, muebles y vigas',
  '/casa/': 'Pintor de casas en Valencia | Pintamos tu vivienda',
  '/diseno-3d/': 'Diseño 3D de pintura en Valencia | Pintor Valencia',
  '/empapelado-papel-pintado/': 'Empapelado y papel pintado en Valencia | Pintor Valencia',
  '/escayolista/': 'Escayolista en Valencia | Techos, molduras y falsos techos',
  '/impermeabilizaciones/': 'Impermeabilizaciones en Valencia | Terrazas y tejados',
  '/microcemento/': 'Microcemento en Valencia | Suelos y paredes sin obra',
  '/pintar-barandilla/': 'Pintar barandillas en Valencia | Pintor Valencia',
  '/pintar-molduras-zocalos/': 'Pintar molduras y zócalos en Valencia | Pintor Valencia',
  '/pintar-paredes/': 'Pintar paredes en Valencia | Pintor Valencia',
  '/pintar-porton/': 'Pintar portones y puertas exteriores en Valencia',
  '/pintar-reparar-grietas/': 'Reparar grietas en Valencia | Pintor Valencia',
  '/pintor-de-paredes-y-techos/': 'Pintor de paredes y techos en Valencia | Pintor Valencia',
  '/pintor-piso/': 'Pintor de pisos en Valencia | Pintamos tu piso',
  '/pintores-de-fachadas/': 'Pintor de fachadas en Valencia | Pintar y rehabilitar',
  '/pintores-de-interiores/': 'Pintor de interiores en Valencia | Pintor Valencia',
  '/pintores-industriales/': 'Pintores industriales en Valencia | Naves y locales',
  '/pintores-para-comunidades/': 'Pintores para comunidades en Valencia | Zonas comunes',
  '/pintores-para-empresas/': 'Pintores para empresas en Valencia | Oficinas y locales',
  '/pintores-particulares/': 'Pintores para particulares en Valencia | Pintor Valencia',
  '/pintura-de-exteriores/': 'Pintura de exteriores en Valencia | Fachadas y muros',
  '/pintura-decorativa-estucos/': 'Pintura decorativa y estucos en Valencia',
  '/pintura-ecologica-antibacteriana/': 'Pintura ecológica y antibacteriana en Valencia',
  '/pladur/': 'Pladur en Valencia | Tabiques, techos y trasdosados',
  '/preparar-superficies-pintar/': 'Preparar superficies para pintar en Valencia',
  '/presupuesto/': 'Presupuesto de pintor en Valencia | Gratis y sin compromiso',
  '/quitar-gotele-alisar-paredes/': 'Quitar gotelé y alisar paredes en Valencia',
  '/reformas-pladur/': 'Reformas de pladur en Valencia | Pintor Valencia',
  '/remodelaciones-reformas-proyectos/': 'Reformas y remodelaciones en Valencia | Llave en mano',
  '/servicios-pintura/': 'Servicios de pintura en Valencia | Empresa de pintores',
  '/suelos-epoxi-garajes/': 'Suelos epoxi en Valencia | Garajes y naves',
  '/tienda-pinturas/': 'Tienda de pinturas en Valencia | Pinturería',
};

// Título tal como lo pinta Base.astro (resolverTitulo).
const resuelto = (p) => (p.metaTitulo || p.titulo)
  .replaceAll('%%title%%', p.titulo).replaceAll('%%sitename%%', site.nombre).replaceAll('%%sep%%', '-')
  .replaceAll('%%page%%', '').replaceAll('%%primary_category%%', '')
  .replace(/\s{2,}/g, ' ').replace(/^[\s-]+|[\s-]+$/g, '').trim();

function propuesta(p) {
  if (MANUALES[p.url]) return MANUALES[p.url];
  const slug = p.url.replace(/^\/|\/$/g, '');
  let familia = null, municipio = null;
  if (ZONA_POR_URL[p.url]) { familia = 'pintor'; municipio = MUNICIPIOS[ZONA_POR_URL[p.url]]; }
  for (const f of ['fachadas-', 'escayolista-', 'pladur-']) {
    if (slug.startsWith(f)) { familia = f; municipio = MUNICIPIOS[slug.slice(f.length)]; }
  }
  if (!municipio) return null;
  return PLANTILLAS[familia](municipio).find((t) => t.length <= MAX) ?? null;
}

let cambios = 0;
const sinPropuesta = [], ejemplos = [];
for (const archivo of fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).sort()) {
  const ruta = path.join(DIR, archivo);
  const texto = fs.readFileSync(ruta, 'utf8');
  const p = JSON.parse(texto);
  if (!p.url || p.noindex) continue;
  const actual = resuelto(p);
  if (actual.length <= MAX) continue;
  const nuevo = propuesta(p);
  if (!nuevo) { sinPropuesta.push(`${actual.length} ${p.url} ${actual}`); continue; }
  if (nuevo.length > MAX) throw new Error(`${p.url}: «${nuevo}» pasa de ${MAX}`);
  cambios++;
  if (ejemplos.length < 12) ejemplos.push(`${p.url}\n  - ${actual}\n  + ${nuevo} (${nuevo.length})`);
  if (APLICAR) {
    // Se cambia solo el valor en el texto: reserializar todo el JSON movería los saltos
    // de línea (CRLF) y los \u escapados, y el diff sería el archivo entero.
    const valor = JSON.stringify(nuevo);
    const editado = /"metaTitulo": "(?:[^"\\]|\\.)*"/.test(texto)
      ? texto.replace(/"metaTitulo": "(?:[^"\\]|\\.)*"/, () => `"metaTitulo": ${valor}`)
      : texto.replace(/("titulo": "(?:[^"\\]|\\.)*",)(\r?\n)(\s*)/, (_, a, nl, sp) => `${a}${nl}${sp}"metaTitulo": ${valor},${nl}${sp}`);
    if (JSON.parse(editado).metaTitulo !== nuevo) throw new Error(`${p.url}: no se pudo escribir metaTitulo`);
    fs.writeFileSync(ruta, editado);
  }
}
console.log(ejemplos.join('\n'));
console.log(`\n${APLICAR ? 'Cambiados' : 'Se cambiarían'}: ${cambios}`);
if (sinPropuesta.length) console.log(`Sin propuesta (${sinPropuesta.length}):\n${sinPropuesta.join('\n')}`);
