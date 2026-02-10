"use client";

import { useCallback } from 'react';

interface EventData {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
  [key: string]: string | number | boolean | undefined;
}

// Generar event_id único para deduplicación
function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Valores aleatorios para simular variación natural en ROAS
const LEAD_VALUES = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export function useMetaTracking() {
  const trackEvent = useCallback((
    eventName: string,
    customData: EventData = {}
  ) => {
    // Enviar evento via Pixel (client-side)
    if (typeof window !== 'undefined' && window.fbq) {
      // Generar event_id único para evitar duplicados
      const eventId = generateEventId();

      // Enviar con event_id para deduplicación
      window.fbq('track', eventName, customData, { eventID: eventId });

      // Log siempre (incluye URL de origen para debugging)
      console.log(`[Meta Pixel] Evento "${eventName}" enviado desde:`, {
        url: window.location.href,
        hostname: window.location.hostname,
        eventID: eventId,
        data: customData
      });
    }
  }, []);

  // Eventos específicos predefinidos para facilitar el uso
  const trackLead = useCallback((source: string, trackingId?: string) => {
    const randomValue = LEAD_VALUES[Math.floor(Math.random() * LEAD_VALUES.length)];
    // Disparar evento custom ClicktoKommo con external_id para atribución Meta
    trackEvent('ClicktoKommo', {
      content_name: 'Solicitud de Usuario WhatsApp',
      content_category: 'Lead Generation',
      content_type: 'whatsapp_click',
      source: source, // 'main_button' o 'secondary_button'
      value: randomValue,
      currency: 'USD',
      external_id: trackingId,
    });
  }, [trackEvent]);

  const trackContact = useCallback((source: string) => {
    trackEvent('Contact', {
      content_name: 'Contacto via WhatsApp',
      content_category: 'Contact',
      source: source,
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackLead,
    trackContact,
  };
}
