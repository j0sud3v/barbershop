/**
 * Debe coincidir con la lógica de app.js (isDevTunnelOrLocalOrigin).
 * Si cambias CORS en app.js, actualiza estas pruebas.
 */
import assert from "node:assert";
import test from "node:test";

function isDevTunnelOrLocalOrigin(origin) {
  try {
    const { protocol, hostname } = new URL(origin);
    if (protocol !== "https:" && protocol !== "http:") return false;
    if (hostname.endsWith(".devtunnels.ms")) return true;
    if (hostname.includes("tunnels.api.visualstudio.com")) return true;
    if (hostname === "localhost" || hostname === "127.0.0.1") return true;
    return false;
  } catch {
    return false;
  }
}

test("acepta Microsoft Dev Tunnel (use2)", () => {
  assert.ok(
    isDevTunnelOrLocalOrigin("https://1kbmr1vv-5173.use2.devtunnels.ms")
  );
});

test("acepta localhost http", () => {
  assert.ok(isDevTunnelOrLocalOrigin("http://localhost:5173"));
});

test("rechaza origen arbitrario", () => {
  assert.equal(isDevTunnelOrLocalOrigin("https://evil.example.com"), false);
});

test("URL inválida → false", () => {
  assert.equal(isDevTunnelOrLocalOrigin("not-a-url"), false);
});
