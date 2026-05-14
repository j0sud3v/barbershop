import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  db.all('SELECT * FROM servicios', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener servicios' });
    }

    const servicios = rows.map(s => ({
      id: s.id,
      nameService: s.nombre,
      description: s.descripcion,
      image: s.imagen
    }));

    res.json(servicios);
  });
});

export default router;