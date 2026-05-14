import type { Node } from "../types/stepsTypes"
export const flow: Record<string, Node> = {
  start: {
    id: 'start',
    message: 'Hola 👋 Soy BarberBot, ¿en qué puedo ayudarte?',
    options: [
      { label: 'Agendar cita', next: 'appointment_type' },
      { label: 'Consulta', next: 'consultation' }
    ]
  },

  appointment_type: {
    id: 'appointment_type',
    message: '¿Para cuándo deseas tu cita?',
    options: [
      { label: 'Para hoy', next: 'today_time' },
      { label: 'Elegir fecha', next: 'pick_date' }
    ]
  },

  today_time: {
    id: 'today_time',
    message: 'Selecciona una hora disponible',
    options: [
      { label: '09:00 AM', next: 'confirm' },
      { label: '10:00 AM', next: 'confirm' },
      { label: '11:00 AM', next: 'confirm' },
      { label: '12:00 AM', next: 'confirm' },
      { label: '13:00 AM', next: 'confirm' },
      { label: '14:00 AM', next: 'confirm' },
      { label: '15:00 AM', next: 'confirm' },
      { label: '16:00 AM', next: 'confirm' },
      { label: '17:00 AM', next: 'confirm' },
      { label: '18:00 AM', next: 'confirm' },
      { label: '19:00 AM', next: 'confirm' },
      { label: '20:00 AM', next: 'confirm' },
      { label: '21:00 AM', next: 'confirm' },
      { label: '22:00 AM', next: 'confirm' }
    ]
  },

  pick_date: {
    id: 'pick_date',
    message: 'Selecciona una fecha',
    input: 'date',
    next: 'confirm'
  },

  // 👉 CONSULTA
  consultation: {
    id: 'consultation',
    message: '¿Qué tipo de consulta tienes?',
    options: [
      { label: 'Precios', next: 'prices' },
      { label: 'Ubicación', next: 'location' },
      { label: 'Hablar con humano', next: 'human' }
    ]
  },

  prices: {
    id: 'prices',
    message: 'Nuestros precios van desde $5 💈',
    options: [{ label: 'Volver', next: 'start' }]
  },

  location: {
    id: 'location',
    message: 'Estamos en Guayaquil 📍',
    options: [{ label: 'Volver', next: 'start' }]
  },

  human: {
    id: 'human',
    message: 'Te contactaremos pronto 👨‍💼',
    options: [{ label: 'Volver al inicio', next: 'start' }]
  },

  confirm: {
    id: 'confirm',
    message: '✅ Tu cita ha sido registrada',
    options: [{ label: 'Volver al inicio', next: 'start' }]
  }
}