// Corrige erratas heredadas de WordPress y pone alt a las dos imágenes de la plantilla
// que salían con alt="" en casi todas las páginas.
// Uso: node scripts/erratas.mjs        (en seco: recuento por regla)
//      node scripts/erratas.mjs --aplicar
// Se puede ejecutar dos veces: la segunda pasada da 0 cambios.
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/content/pages';
const APLICAR = process.argv.includes('--aplicar');

// Se trabaja sobre el texto del JSON, así que las comillas del HTML van escapadas (\").
const REGLAS = [
  ['INDUTRIALES', /INDUTRIALES/g, 'INDUSTRIALES'],
  ['¿Estas buscando', /¿Estas buscando/g, '¿Estás buscando'],
  ['alt presupuesto', /(src=\\"\/wp-content\/uploads\/2023\/11\/presupuesto-de-pintor\.png\\" )alt=\\"\\"/g,
    '$1alt=\\"Presupuesto de pintor gratis y sin compromiso\\"'],
  ['alt alisado', /(src=\\"\/wp-content\/uploads\/2023\/11\/alisado-de-paredes\.jpg\\" )alt=\\"\\"/g,
    '$1alt=\\"Pared alisada y lista para pintar\\"'],
];

const recuento = Object.fromEntries(REGLAS.map(([n]) => [n, 0]));
let archivos = 0;
for (const archivo of fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).sort()) {
  const ruta = path.join(DIR, archivo);
  const texto = fs.readFileSync(ruta, 'utf8');
  let nuevo = texto;
  for (const [nombre, re, sustituto] of REGLAS) {
    nuevo = nuevo.replace(re, (...m) => { recuento[nombre]++; return m[0].replace(new RegExp(re.source), sustituto); });
  }
  if (nuevo === texto) continue;
  JSON.parse(nuevo);
  archivos++;
  if (APLICAR) fs.writeFileSync(ruta, nuevo);
}
console.log(recuento);
console.log(`${APLICAR ? 'Cambiados' : 'Se cambiarían'}: ${archivos} archivos`);
