import jwt from 'jsonwebtoken';

const JWT_COOKIE_NAME = 'session';

function getJwtSecret() {
  return process.env.JWT_SECRET || null;
}

export function requireAuth(req, res, next) {
  const jwtSecret = getJwtSecret();
  if (!jwtSecret) {
    return res.status(500).json({ ok: false, error: 'Falta configurar JWT_SECRET en el backend' });
  }

  const token = req.cookies?.[JWT_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ ok: false, error: 'No autenticado' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.userId = Number(payload.sub);
    if (!Number.isFinite(req.userId)) {
      return res.status(401).json({ ok: false, error: 'Sesión inválida' });
    }
    next();
  } catch {
    return res.status(401).json({ ok: false, error: 'Sesión inválida o expirada' });
  }
}
