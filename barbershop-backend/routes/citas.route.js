import express from 'express';

import db from '../db.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  db.all('SELECT * FROM citas', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: 'Error al listar citas' });
    }
    res.json({ ok: true, citas: rows });
  });
});

router.post('/', requireAuth, (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      ok: false,
      error: 'Body JSON requerido (Content-Type: application/json)'
    });
  }
  const { fecha, hora, servicio_id } = body;
  if (fecha == null || hora == null || servicio_id == null) {
    return res.status(400).json({
      ok: false,
      error: 'Los campos fecha, hora y servicio_id son obligatorios'
    });
  }
  const usuarioId = req.userId;

  db.get(
    'SELECT id, fecha, hora FROM citas WHERE cliente_id = ? LIMIT 1',
    [usuarioId],
    (errExist, existing) => {
      if (errExist) {
        console.error(errExist);
        return res.status(500).json({ ok: false, error: 'Error al verificar citas' });
      }
      if (existing) {
        return res.status(409).json({
          ok: false,
          error: 'Ya tienes una cita registrada',
          cita: existing
        });
      }

      db.get('SELECT nombre FROM usuarios WHERE id = ?', [usuarioId], (errUser, userRow) => {
        if (errUser) {
          console.error(errUser);
          return res.status(500).json({ ok: false, error: 'Error al obtener usuario' });
        }
        if (!userRow) {
          return res.status(401).json({ ok: false, error: 'Usuario no encontrado' });
        }
        const nombres = userRow.nombre != null && String(userRow.nombre).trim() !== ''
          ? String(userRow.nombre).trim()
          : null;

        db.run(
          'INSERT INTO citas (fecha, hora, cliente_id, servicio_id, nombres) VALUES (?, ?, ?, ?, ?)',
          [fecha, hora, usuarioId, servicio_id, nombres],
          function (err) {
            if (err) {
              console.error(err);
              const payload = { ok: false, error: 'Error al crear cita' };
              if (process.env.NODE_ENV !== 'production') {
                payload.detail = err.message;
                if (err.code) payload.code = err.code;
              }
              return res.status(500).json(payload);
            }
            res.json({ ok: true, message: 'Cita creada', id: this.lastID });
          }
        );
      });
    }
  );
});
export default router;