import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import serviciosRoutes from './routes/services.route.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.route.js';
import citasRoutes from './routes/citas.route.js';
const app = express();

const PORT = process.env.PORT || 3001;

const allowedOrigins = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
  console.warn(
    '[CORS] FRONTEND_ORIGIN vacío: se permite cualquier origen. En producción conviene listar tu front.'
  );
}

function isDevTunnelOrLocalOrigin(origin) {
  try {
    const { protocol, hostname } = new URL(origin);
    if (protocol !== 'https:' && protocol !== 'http:') return false;
    if (hostname.endsWith('.devtunnels.ms')) return true;
    if (hostname.includes('tunnels.api.visualstudio.com')) return true;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    return false;
  } catch {
    return false;
  }
}

function corsAllowsOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.length === 0) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (isDevTunnelOrLocalOrigin(origin)) return true;
  return false;
}

function applyCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (origin && corsAllowsOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (corsAllowsOrigin(origin)) {
        return callback(null, true);
      }
      console.warn('[CORS] Origen no permitido:', origin);
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    optionsSuccessStatus: 204
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/servicios', serviciosRoutes);
app.use('/usuarios', usersRoutes);
app.use('/citas', citasRoutes);

app.get('/', (req, res) => {
    res.send('¡Hola desde mi backend!');
});

app.get('/health', (req, res) => {
  const mail =
    process.env.RESEND_API_KEY && process.env.MAIL_FROM
      ? 'resend'
      : process.env.EMAIL_USER && process.env.EMAIL_PASS
        ? 'gmail'
        : 'none';
  res.json({
    ok: true,
    mail,
    mailStack: 'gmail-587-then-465-ipv4',
    hasFrontendOrigin: Boolean(process.env.FRONTEND_ORIGIN)
  });
});

app.use((err, req, res, next) => {
  console.error('[express]', err);
  if (!res.headersSent) {
    applyCorsHeaders(req, res);
    res.status(500).json({ ok: false, error: 'Error interno del servidor' });
  } else {
    next(err);
  }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando en puerto ${PORT}`);
});