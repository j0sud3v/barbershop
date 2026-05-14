import assert from "node:assert";
import test from "node:test";

test("mail.service exporta enviarCodigo", async () => {
  const mod = await import("../services/mail.service.js");
  assert.strictEqual(typeof mod.enviarCodigo, "function");
});
