import { API_URL, authFetch } from "../config/api";

export type CrearCitaPayload = {
  fecha: string;
  hora: string;
  servicio_id: number;
};

export type CitaExistente = {
  id: number;
  fecha: string;
  hora: string;
};

export type CrearCitaResponse = {
  ok: boolean;
  message?: string;
  id?: number;
  error?: string;
  detail?: string;
  code?: string;
  cita?: CitaExistente;
};

export class CitaDuplicadaError extends Error {
  cita?: CitaExistente;
  constructor(message: string, cita?: CitaExistente) {
    super(message);
    this.name = "CitaDuplicadaError";
    this.cita = cita;
  }
}

export async function crearCita(
  payload: CrearCitaPayload,
): Promise<CrearCitaResponse> {
  console.log("[crearCita] payload enviado:", payload);

  const res = await authFetch(`${API_URL}/citas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => ({}))) as CrearCitaResponse;

  console.log("[crearCita] status:", res.status, "response:", data);

  if (res.status === 401) {
    throw new Error("No autenticado. Inicia sesión de nuevo.");
  }

  if (res.status === 409) {
    throw new CitaDuplicadaError(
      data.error ?? "Ya tienes una cita registrada",
      data.cita,
    );
  }

  if (!res.ok || data.ok === false) {
    const extra =
      "detail" in data &&
      typeof (data as { detail?: string }).detail === "string"
        ? ` (${(data as { detail: string }).detail})`
        : "";
    throw new Error((data.error ?? `HTTP ${res.status}`) + extra);
  }

  return data;
}
