import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('./barbershop.db');

try {
  const cols = db.prepare('PRAGMA table_info(usuarios);').all();
  const hasNombre = cols.some((c) => c.name === 'nombre');
  if (hasNombre) {
    console.log('Columna nombre ya existe en usuarios.');
  } else {
    db.exec('ALTER TABLE usuarios ADD COLUMN nombre TEXT;');
    console.log('Columna nombre agregada a usuarios.');
  }
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  db.close();
}
