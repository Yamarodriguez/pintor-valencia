/* Interlinking de toda la web. Se calcula desde zonas.json, menu.json y los
   datos de negocio.js: añadir una zona o un servicio solo exige tocar esos
   datos, nunca las 515 páginas. */
import zonas from '../data/zonas.json';
import menu from '../data/menu.json';
import { MUNICIPIOS, PAGINA_PINTORES } from './negocio.js';

/* Cuántas zonas cercanas enlaza cada página. */
const CERCANAS = 6;

/* Cada familia: cómo se llama la página de un municipio y cuál es su índice. */
export const FAMILIAS = {
  pintores: {
    url: (base) => PAGINA_PINTORES[base],
    texto: (nombre) => `Pintores en ${nombre}`,
    plural: 'Pintores',
    padre: { url: '/zonas/', todas: 'Ver todas las zonas' },
  },
  fachadas: {
    url: (base) => `/fachadas-${base}/`,
    texto: (nombre) => `Fachadas en ${nombre}`,
    plural: 'Fachadas',
    padre: { url: '/pintores-de-fachadas/', todas: 'Ver fachadas en todas las zonas' },
  },
  escayola: {
    url: (base) => `/escayolista-${base}/`,
    texto: (nombre) => `Escayolista en ${nombre}`,
    plural: 'Escayolistas',
    padre: { url: '/escayolista/', todas: 'Ver escayolistas en todas las zonas' },
  },
  pladur: {
    url: (base) => `/pladur-${base}/`,
    texto: (nombre) => `Pladur en ${nombre}`,
    plural: 'Pladur',
    padre: { url: '/pladur/', todas: 'Ver pladur en todas las zonas' },
  },
};

/* Índice inverso: de cada URL local a su municipio, familia y grupo. */
const POR_URL = new Map();
for (const grupo of zonas.grupos) {
  for (const base of grupo.zonas) {
    if (!MUNICIPIOS[base]) throw new Error(`zonas.json: zona desconocida «${base}»`);
    for (const [familia, f] of Object.entries(FAMILIAS)) {
      POR_URL.set(f.url(base), { base, familia, grupo });
    }
  }
}

/* Convierte un nombre de grupo en el ancla de /zonas/#...: sin tildes,
   apóstrofos ni espacios. */
export const anclaGrupo = (nombre) =>
  nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/* Las zonas de cada comarca como enlaces de una familia: lo usan los índices. */
export function gruposDeFamilia(familia) {
  const f = FAMILIAS[familia];
  return zonas.grupos.map((g) => ({
    nombre: g.nombre,
    ancla: anclaGrupo(g.nombre),
    enlaces: g.zonas.map((base) => ({ url: f.url(base), texto: MUNICIPIOS[base] })),
  }));
}

/* Enlaces de una página de zona: sus otros servicios en el municipio y las
   siguientes zonas de la comarca, de forma circular para que todas reciban
   el mismo número de enlaces. */
export function enlacesDeZona(url) {
  const local = POR_URL.get(url);
  if (!local) return null;
  const { base, familia, grupo } = local;
  const nombre = MUNICIPIOS[base];
  const f = FAMILIAS[familia];

  const servicios = Object.entries(FAMILIAS)
    .filter(([clave]) => clave !== familia)
    .map(([, otra]) => ({ url: otra.url(base), texto: otra.texto(nombre) }));

  const i = grupo.zonas.indexOf(base);
  const total = Math.min(CERCANAS, grupo.zonas.length - 1);
  const cercanas = Array.from({ length: total }, (_, n) => {
    const otra = grupo.zonas[(i + n + 1) % grupo.zonas.length];
    return { url: f.url(otra), texto: f.texto(MUNICIPIOS[otra]) };
  });

  return { nombre, plural: f.plural, servicios, cercanas, indice: f.padre };
}

/* Todos los servicios por grupos: las columnas del menú más los que no caben
   en él. /servicios-pintura/ los lista todos, así ninguno queda sin enlaces. */
export const GRUPOS_SERVICIO = [
  ...menu.principal.find((e) => e.columnas).columnas,
  ...menu.serviciosFueraDelMenu,
];

/* Enlaces de una página de servicio: los demás de su grupo. */
export function enlacesDeServicio(url) {
  const grupo = GRUPOS_SERVICIO.find((c) => c.enlaces.some((e) => e.url === url));
  if (!grupo) return null;
  return {
    titulo: grupo.titulo,
    relacionados: grupo.enlaces.filter((e) => e.url !== url),
  };
}
