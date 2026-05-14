import 'dotenv/config';
import { DatabaseSync } from 'node:sqlite';

const path = process.env.DB_PATH || './barbershop.db';

let database;
try {
  database = new DatabaseSync(path);
  console.log('Conectado a SQLite');
  try {
    database.exec('PRAGMA foreign_keys = ON;');
    database.exec(`
      CREATE TABLE IF NOT EXISTS citas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha TEXT NOT NULL,
        hora TEXT NOT NULL,
        cliente_id INTEGER NOT NULL,
        servicio_id INTEGER NOT NULL,
        nombres TEXT
      );
    `);
    try {
      database.exec('ALTER TABLE citas ADD COLUMN nombres TEXT;');
    } catch {
      /* columna ya existía (tablas creadas antes o tras CREATE anterior) */
    }
  } catch (schemaErr) {
    console.error('Error al asegurar tabla citas:', schemaErr?.message || schemaErr);
  }
} catch (err) {
  console.error(err?.message || err);
}

function bindArgs(params) {
  if (!params || params.length === 0) return [];
  return params;
}

function isSqliteConstraintError(err) {
  if (!err) return false;
  if (err.code === 'SQLITE_CONSTRAINT') return true;
  return /constraint|UNIQUE/i.test(String(err.message || ''));
}

const db = {
  get(sql, params, cb) {
    if (typeof params === 'function') {
      cb = params;
      params = [];
    }
    try {
      const stmt = database.prepare(sql);
      const row = stmt.get(...bindArgs(params));
      cb(null, row);
    } catch (err) {
      cb(err);
    }
  },

  all(sql, params, cb) {
    if (typeof params === 'function') {
      cb = params;
      params = [];
    }
    try {
      const stmt = database.prepare(sql);
      const rows = stmt.all(...bindArgs(params));
      cb(null, rows);
    } catch (err) {
      cb(err);
    }
  },

  run(sql, params, cb) {
    if (typeof params === 'function') {
      cb = params;
      params = [];
    }
    try {
      const stmt = database.prepare(sql);
      const info = stmt.run(...bindArgs(params));
      const ctx = {
        lastID: Number(info.lastInsertRowid ?? 0),
        changes: Number(info.changes ?? 0)
      };
      cb.call(ctx, null);
    } catch (err) {
      if (isSqliteConstraintError(err)) {
        err.code = 'SQLITE_CONSTRAINT';
      }
      cb(err);
    }
  }
};

export default db;
