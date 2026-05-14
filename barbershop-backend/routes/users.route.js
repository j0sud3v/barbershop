import express from 'express';
import db from '../db.js';

const router = express.Router();

// Listar usuarios
router.get('/', (req, res) => {
  db.all('SELECT id, email, rol, nombre FROM usuarios ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: 'Error al listar usuarios' });
    }
    res.json({ ok: true, usuarios: rows });
  });
});

// Crear usuario
router.post('/', (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      ok: false,
      error:
        'Body JSON requerido (Content-Type: application/json). Ejemplo: {"email":"...","password":"..."}'
    });
  }
  const { email, password, rol, nombre, name } = body;
  const nombreFinal = (nombre ?? name ?? '').trim() || null;

  if (!email || !password) {
    return res.status(400).json({ ok: false, error: 'Email y password son obligatorios' });
  }

  db.run(
    'INSERT INTO usuarios (email, password, rol, nombre) VALUES (?, ?, ?, ?)',
    [email, password, rol ?? 'cliente', nombreFinal],
    function (err) {
      if (err) {
        console.error(err);
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(409).json({ ok: false, error: 'El email ya está registrado' });
        }
        return res.status(500).json({ ok: false, error: 'Error al crear usuario' });
      }

      res.json({
        ok: true,
        message: 'Usuario creado',
        id: this.lastID
      });
    }
  );
});

/** Borrar un usuario por id (útil para pruebas; en producción conviene protegerlo). */
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ ok: false, error: 'id inválido' });
  }

  db.run('DELETE FROM usuarios WHERE id = ?', [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: 'Error al borrar usuario' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    }
    res.json({ ok: true, message: 'Usuario borrado', borrados: this.changes });
  });
});

export default router;