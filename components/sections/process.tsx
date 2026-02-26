const STEPS = [
  {
    n: 1,
    title: "Registro de Solicitud",
    desc: "Complete el formulario con sus datos y una descripción clara del problema o consulta técnica.",
  },
  {
    n: 2,
    title: "Asignación de Ticket",
    desc: "El sistema registra su solicitud y se asigna automáticamente a un técnico especializado.",
  },
  {
    n: 3,
    title: "Diagnóstico y Atención",
    desc: "El técnico contacta al usuario para diagnosticar y resolver el incidente en el menor tiempo posible.",
  },
  {
    n: 4,
    title: "Cierre y Seguimiento",
    desc: "Se documenta la solución aplicada y se hace seguimiento para garantizar la conformidad del usuario.",
  },
];

export default function Process() {
  return (
    <section id="proceso" className="py-20" style={{ background: "var(--background)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-[.14em] uppercase mb-2"
            style={{ color: "var(--brand-accent)" }}
          >
            ¿Cómo funciona?
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Proceso de Atención
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-12 rounded-full"
            style={{ background: "var(--brand-accent)" }}
          />
        </div>

        {/* Steps */}
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {STEPS.map((step) => (
            <div key={step.n} className="flex items-start gap-5">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold text-lg shadow"
                style={{ background: "var(--brand-accent)" }}
              >
                {step.n}
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-base mb-1 text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
