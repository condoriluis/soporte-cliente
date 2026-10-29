"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/landing/section-heading";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { CONTACT } from "@/lib/contact";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "¿Atienden a domicilio?",
    answer:
      "Sí, ofrecemos servicio a domicilio en toda la ciudad. Coordinamos una fecha y horario que te convenga. Nuestro técnico se traslada con las herramientas necesarias para atender tu equipo en tu ubicación.",
  },
  {
    question: "¿Cuánto cuesta el servicio?",
    answer:
      "El costo depende del tipo de servicio y la complejidad del problema. Contáctanos por WhatsApp con los detalles y te brindamos una cotización sin compromiso. También tenemos planes para que elijas el que mejor se adapte a tus necesidades.",
  },
  {
    question: "¿Cuánto demora el servicio?",
    answer:
      "La mayoría de servicios se completan entre 1 y 4 horas dependiendo del problema. Para soporte remoto, puede ser incluso más rápido. Si necesitas un servicio urgente, consúltanos por disponibilidad inmediata.",
  },
  {
    question: "¿Atienden laptops de todas las marcas?",
    answer:
      "Sí, trabajamos con todas las marcas: HP, Lenovo, Dell, Asus, Acer, Samsung, Apple MacBook y más. Nuestros técnicos están capacitados para trabajar con cualquier marca y modelo.",
  },
  {
    question: "¿El soporte remoto es seguro?",
    answer:
      "Absolutamente. Utilizamos herramientas de acceso remoto certificadas y el usuario puede ver todo lo que hace el técnico en pantalla. Además, el acceso se termina al finalizar la sesión y no conservamos acceso a tu equipo.",
  },
  {
    question: "¿Qué zonas cubren?",
    answer:
      "Cubrimos toda el área metropolitana. Si tu zona no aparece en nuestro formulario, escríbenos por WhatsApp y confirmamos la disponibilidad para tu ubicación.",
  },
  {
    question: "¿Cómo se realizan los pagos?",
    answer:
      "Aceptamos efectivo, transferencia bancaria y pago por QR. El pago se realiza al finalizar el servicio, una vez que confirmes que todo funciona correctamente. No solicitamos anticipos para servicios individuales.",
  },
  {
    question: "¿Ofrecen garantía?",
    answer:
      "Sí, todos nuestros servicios incluyen garantía. Si después del servicio el mismo problema persiste, lo solucionamos sin costo adicional dentro del período de garantía del servicio contratado.",
  },
  {
    question: "¿Puedo hacer seguimiento de mi solicitud?",
    answer:
      "Sí, una vez que generas tu solicitud recibes un código de seguimiento. Puedes usarlo en nuestra página para ver el estado de tu ticket en tiempo real, o simplemente escribirnos por WhatsApp con tu código.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <FadeIn>
              <div className="lg:sticky lg:top-24">
                <SectionHeading
                  index="05"
                  kicker="Preguntas"
                  title="Resolvemos tus dudas antes de empezar."
                  description="Si tu pregunta no está aquí, escríbenos y te respondemos personalmente."
                />

                <div className="mt-8 rounded-2xl border bg-card p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#25D366]/10">
                      <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        ¿Prefieres hablar con alguien?
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Respuesta en horario laboral.
                      </p>
                    </div>
                  </div>
                  <a
                    href={CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    Escribir por WhatsApp
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-7">
            <FadeIn delay={0.1}>
              <div className="divide-y divide-border rounded-2xl border bg-card">
                {FAQ_DATA.map((item, index) => {
                  const open = openIndex === index;
                  return (
                    <div key={item.question}>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenIndex(open ? null : index)
                        }
                        aria-expanded={open}
                        aria-controls={`faq-panel-${index}`}
                        id={`faq-trigger-${index}`}
                        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                      >
                        <span className="text-sm font-medium text-foreground sm:text-base">
                          {item.question}
                        </span>
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-muted-foreground transition-all duration-300",
                            open &&
                              "rotate-45 border-brand bg-brand text-white",
                          )}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            id={`faq-panel-${index}`}
                            role="region"
                            aria-labelledby={`faq-trigger-${index}`}
                            initial={
                              reduce ? false : { height: 0, opacity: 0 }
                            }
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.28,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
