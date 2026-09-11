"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { useSettings } from "@/lib/settings-context";
import { CONTACT } from "@/lib/contact";

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const settings = useSettings();

  const whatsappUrl = `${CONTACT.whatsappUrl}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`;

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex flex-col items-start"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, originX: "0%", originY: "100%" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-4 w-72 overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex items-center gap-3 bg-[#25D366] p-4 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <WhatsAppIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold">{settings.institutionName}</p>
                <p className="text-xs opacity-90">Soporte en línea</p>
              </div>
            </div>

            <div className="relative bg-[#e5ddd5] p-4 text-sm dark:bg-zinc-800">
              <div className="relative rounded-lg bg-white p-3 shadow-sm dark:bg-zinc-900 dark:text-zinc-100">
                <p className="leading-relaxed">
                  ¡Hola! ¿En qué podemos ayudarte? Te respondemos rápido por WhatsApp.
                </p>
                <span className="absolute -left-2 top-2 h-0 w-0 border-y-8 border-r-[10px] border-y-transparent border-r-white dark:border-r-zinc-900" />
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-zinc-900">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
              >
                Iniciar Chat
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-shadow hover:shadow-xl"
        aria-label="Contactar por WhatsApp"
        aria-expanded={open}
      >
        <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#25D366]" />
        {open ? (
          <span className="relative text-2xl font-light leading-none">×</span>
        ) : (
          <WhatsAppIcon className="relative h-7 w-7" />
        )}
      </motion.button>
    </div>
  );
}