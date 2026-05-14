import { generarCodigo } from '../utils/generarCodigo.js';
import { enviarCodigo } from '../services/mail.service.js';
import db from '../db.js';
import jwt from 'jsonwebtoken';

const codes = {};

const JWT_COOKIE_NAME = 'session';
const JWT_EXPIRES_IN = '7d';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return secret;
}

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

export const sendCode = async (req, res) => {
  try {
    const body = req.body;
    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        ok: false,
        error:
          'Body vacío o no JSON. En Postman: Body → raw → JSON y header Content-Type: application/json. Ejemplo: {"email":"tu@correo.com"}'
      });
    }
    const { email } = body;
    if (!email) {
      return res.status(400).json({ ok: false, error: 'El campo email es obligatorio' });
    }

    const codigo = generarCodigo();

    codes[email] = {
      code: codigo,
      expires: Date.now() + 5 * 60 * 1000
    };

    try {
      await enviarCodigo(email, codigo);
    } catch (mailErr) {
      delete codes[email];
      console.error('ERROR MAIL send-code:', mailErr);
      const mailMsg = String(mailErr?.message || '');
      if (mailMsg.includes('Correo no configurado') || mailMsg.includes('Faltan EMAIL')) {
        return res.status(500).json({
          ok: false,
          error:
            'El servidor no tiene configurado el correo. En Render añade RESEND_API_KEY y MAIL_FROM, o EMAIL_USER y EMAIL_PASS (Gmail).'
        });
      }
      if (mailErr?.code === 'RESEND_API') {
        return res.status(502).json({
          ok: false,
          error: mailMsg
        });
      }
      return res.status(500).json({
        ok: false,
        error: 'No se pudo enviar el correo'
      });
    }

    return res.json({ ok: true, message: 'Código enviado' });
  } catch (error) {
    console.error('ERROR BACKEND send-code:', error);
    return res.status(500).json({
      ok: false,
      error: 'Error al procesar la solicitud'
    });
  }
};

export const verifyCode = (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      ok: false,
      error: 'Body JSON requerido (Content-Type: application/json)'
    });
  }
  const { email, code } = body;

  const data = codes[email];

  if (!data) return res.status(400).json({ ok: false, error: 'No hay código' });

  if (Date.now() > data.expires) {
    return res.status(400).json({ ok: false, error: 'Código expirado' });
  }

  if (data.code !== code) {
    return res.status(400).json({ ok: false, error: 'Código incorrecto' });
  }

  delete codes[email];

  res.json({ ok: true });
};

export const login = (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      ok: false,
      error: 'Body JSON requerido (Content-Type: application/json)'
    });
  }
  const { email, password } = body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, error: 'Email y password son obligatorios' });
  }

  const jwtSecret = getJwtSecret();
  if (!jwtSecret) {
    return res.status(500).json({ ok: false, error: 'Falta configurar JWT_SECRET en el backend' });
  }

  db.get(
    'SELECT id, email, password, rol, nombre FROM usuarios WHERE email = ?',
    [email],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ ok: false, error: 'Error al iniciar sesión' });
      }

      if (!row) {
        return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
      }

      if (row.password !== password) {
        return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { sub: row.id, email: row.email, rol: row.rol, nombre: row.nombre ?? null },
        jwtSecret,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.cookie(JWT_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProduction(),
        sameSite: isProduction() ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.json({
        ok: true,
        usuario: {
          id: row.id,
          email: row.email,
          rol: row.rol,
          nombre: row.nombre ?? null
        }
      });
    }
  );
};

export const me = (req, res) => {
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

    db.get(
      'SELECT id, email, rol, nombre FROM usuarios WHERE id = ?',
      [payload.sub],
      (err, row) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ ok: false, error: 'Error al obtener usuario' });
        }
        if (!row) {
          return res.status(401).json({ ok: false, error: 'Usuario no encontrado' });
        }
        return res.json({
          ok: true,
          usuario: {
            id: row.id,
            email: row.email,
            rol: row.rol,
            nombre: row.nombre ?? null
          }
        });
      }
    );
  } catch {
    return res.status(401).json({ ok: false, error: 'Sesión inválida o expirada' });
  }
};

export const logout = (req, res) => {
  res.clearCookie(JWT_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? 'none' : 'lax'
  });
  return res.json({ ok: true });
};