/**
 * Envío REAL de correo (usa tu .env o variables del sistema).
 * No se ejecuta salvo que definas RUN_MAIL_TEST=1 y TEST_MAIL_TO.
 *
 *   set RUN_MAIL_TEST=1
 *   set TEST_MAIL_TO=tu@email.com
 *   npm test
 */
import assert from "node:assert";
import test from "node:test";

const runLive = process.env.RUN_MAIL_TEST === "1";
const testTo = process.env.TEST_MAIL_TO?.trim();

test(
  "envío real (RUN_MAIL_TEST=1 y TEST_MAIL_TO requeridos)",
  { skip: !runLive || !testTo },
  async () => {
    const { enviarCodigo } = await import("../services/mail.service.js");
    await assert.doesNotReject(() =>
      enviarCodigo(testTo, String(Math.floor(100000 + Math.random() * 900000)))
    );
  }
);

test("placeholder cuando no hay prueba en vivo", { skip: runLive && testTo }, () => {
  assert.ok(true);
});
