"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "¿Atienden a domicilio?",
    answer: "Sí, ofrecemos servicio a domicilio en toda la ciudad. Coordinamos una fecha y horario que te convenga. Nuestro técnico se traslada con las herramientas necesarias para atender tu equipo en tu ubicación.",
  },
  {
    question: "¿Cuánto cuesta el servicio?",
    answer: "El costo depende del tipo de servicio y la complejidad del problema. Contáctanos por WhatsApp con los detalles y te brindamos una cotización sin compromiso. También tenemos planes para que elijas el que mejor se adapte a tus necesidades.",
  },
  {
    question: "¿Cuánto demora el servicio?",
    answer: "La mayoría de servicios se completan entre 1 y 4 horas dependiendo del problema. Para soporte remoto, puede ser incluso más rápido. Si necesitas un servicio urgente, consúltanos por disponibilidad inmediata.",
  },
  {
    question: "¿Atienden laptops de todas las marcas?",
    answer: "Sí, trabajamos con todas las marcas: HP, Lenovo, Dell, Asus, Acer, Samsung, Apple MacBook y más. Nuestros técnicos están capacitados para trabajar con cualquier marca y modelo.",
  },
  {
    question: "¿El soporte remoto es seguro?",
    answer: "Absolutamente. Utilizamos herramientas de acceso remoto certificadas y el usuario puede ver todo lo que hace el técnico en pantalla. Además, el acceso se termina al finalizar la sesión y no conservamos acceso a tu equipo.",
  },
  {
    question: "¿Qué zonas cubren?",
    answer: "Cubrimos toda el área metropolitana. Si tu zona no aparece en nuestro formulario, escribenos por WhatsApp y confirmamos la disponibilidad para tu ubicación.",
  },
  {
    question: "¿Cómo se realizan los pagos?",
    answer: "Aceptamos efectivo, transferencia bancaria y pago por QR. El pago se realiza al finalizar el servicio, una vez que confirmes que todo funciona correctamente. No solicitamos anticipos para servicios individuales.",
  },
  {
    question: "¿Ofrecen garantía?",
    answer: "Sí, todos nuestros servicios incluyen garantía. Si después del servicio el mismo problema persiste, lo solucionamos sin costo adicional dentro del período de garantía del servicio contratado.",
  },
  {
    question: "¿Puedo hacer seguimiento de mi solicitud?",
    answer: "Sí, una vez que generas tu solicitud recibes un código de seguimiento. Puedes usarlo en nuestra página para ver el estado de tu ticket en tiempo real, o simplemente escribirnos por WhatsApp con tu código.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-[.14em] uppercase mb-3"
            style={{ color: "var(--brand-primary)" }}
          >
            Preguntas frecuentes
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            ¿Tienes dudas?
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-16 rounded-full"
            style={{ background: "var(--brand-primary)" }}
          />
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border bg-card overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-semibold text-foreground text-sm sm:text-base pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform duration-200",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === i ? "max-h-96" : "max-h-0"
                )}
              >
                <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
