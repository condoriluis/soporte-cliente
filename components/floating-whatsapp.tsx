"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/59170000000"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="Contactar por WhatsApp"
    >
      <div className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-black/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
        <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "#25D366" }} />
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "#25D366" }}
        />
        <MessageCircle className="relative w-6 h-6 text-white" />
      </div>
      <span className="absolute bottom-full right-0 mb-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: "var(--brand-primary)" }}>
        ¿Necesitas ayuda?
      </span>
    </a>
  );
}
