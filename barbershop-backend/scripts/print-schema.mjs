import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('./barbershop.db');

try {
  const rows = db
    .prepare(
      `SELECT name, sql
       FROM sqlite_master
       WHERE type = 'table'
       ORDER BY name`
    )
    .all();

  for (const row of rows) {
    console.log(`\n--- ${row.name} ---\n${row.sql}\n`);
  }
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  db.close();
}
