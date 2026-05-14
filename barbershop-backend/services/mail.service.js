import dns from "node:dns";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS?.replace(/\s/g, "");
const resendKey = process.env.RESEND_API_KEY?.trim();
const mailFrom = process.env.MAIL_FROM?.trim();

function htmlCodigo(codigo) {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Código de verificación</h2>
      <p>Tu código es:</p>
      <h1 style="color:#1877f2;">${codigo}</h1>
    </div>
  `;
}

/**
 * Recomendado en Render: https://resend.com
 * RESEND_API_KEY + MAIL_FROM (dominio verificado o onboarding@resend.dev según Resend).
 */
async function enviarConResend(email, codigo) {
  const html = htmlCodigo(codigo);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: mailFrom,
        to: [email],
        subject: "Código de verificación",
        html
      }),
      signal: controller.signal
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Resend HTTP", res.status, JSON.stringify(data));
      const msg =
        typeof data?.message === "string"
          ? data.message
          : typeof data?.name === "string"
            ? `${data.name}: ${JSON.stringify(data)}`
            : `Resend ${res.status}`;
      const err = new Error(msg);
      err.code = "RESEND_API";
      err.status = res.status;
      throw err;
    }
    console.log("EMAIL enviado (Resend)", data?.id ?? "");
  } finally {
    clearTimeout(timer);
  }
}

function createGmailTransport(port, secure) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port,
    secure,
    family: 4,
    lookup(hostname, _opts, cb) {
      dns.lookup(hostname, { family: 4 }, cb);
    },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
    auth: {
      user: emailUser,
      pass: emailPass
    },
    tls: {
      minVersion: "TLSv1.2",
      servername: "smtp.gmail.com"
    }
  });
}

const GMAIL_TIMEOUT_MS = 25_000;

function logSiFalloRedRender(err) {
  const code = err?.code;
  if (
    code === "ETIMEDOUT" ||
    code === "ENETUNREACH" ||
    code === "ECONNRESET" ||
    code === "ESOCKET" ||
    code === "ECONNREFUSED"
  ) {
    console.warn(
      "[mail] Gmail SMTP no conecta desde este servidor (p. ej. Render). " +
        "No es tu contraseña: es la red/SMTP. Usa Resend: RESEND_API_KEY + MAIL_FROM → https://resend.com"
    );
  }
}

async function sendWithTransport(transport, mailOpts, label) {
  let timeoutId;
  const deadline = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("SMTP_TIMEOUT")), GMAIL_TIMEOUT_MS);
  });
  try {
    await Promise.race([transport.sendMail(mailOpts), deadline]);
    clearTimeout(timeoutId);
    console.log(`EMAIL enviado (Gmail SMTP ${label})`);
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function enviarConGmail(email, codigo) {
  if (!emailUser || !emailPass) {
    throw new Error("Faltan EMAIL_USER o EMAIL_PASS");
  }
  const html = htmlCodigo(codigo);
  const mailOpts = {
    from: emailUser,
    to: email,
    subject: "Código de verificación",
    html
  };

  const t587 = createGmailTransport(587, false);
  try {
    await sendWithTransport(t587, mailOpts, "puerto 587");
    return;
  } catch (err587) {
    console.warn("[mail] Gmail 587 falló, probando 465:", err587?.message || err587);
    logSiFalloRedRender(err587);
  }

  const t465 = createGmailTransport(465, true);
  try {
    await sendWithTransport(t465, mailOpts, "puerto 465 SSL");
  } catch (err465) {
    logSiFalloRedRender(err465);
    throw err465;
  }
}

export const enviarCodigo = async (email, codigo) => {
  const modo =
    resendKey && mailFrom ? "resend" : emailUser && emailPass ? "gmail" : "ninguno";
  console.log("[mail] modo de envío:", modo);

  try {
    if (resendKey && mailFrom) {
      await enviarConResend(email, codigo);
      return;
    }
    if (emailUser && emailPass) {
      await enviarConGmail(email, codigo);
      return;
    }
    throw new Error(
      "Correo no configurado: RESEND_API_KEY+MAIL_FROM o EMAIL_USER+EMAIL_PASS"
    );
  } catch (err) {
    console.error("enviarCodigo:", err);
    if (
      typeof err?.message === "string" &&
      (err.message.includes("Correo no configurado") || err.message.includes("Faltan EMAIL"))
    ) {
      throw err;
    }
    if (err?.code === "RESEND_API") {
      throw err;
    }
    throw new Error("Error al enviar el correo");
  }
};
