export interface TestimonioItem {
  id?: string;
  nombre: string;
  cargo: string | null;
  comentario: string;
  calificacion: number;
}

export const INITIAL_TESTIMONIALS = [
  {
    nombre: "María González",
    cargo: "Gerente Administrativa",
    comentario: "Mi laptop estaba funcionando muy lento. En menos de 3 horas la dejaron como nueva. Excelente servicio y muy profesional. Totalmente recomendado.",
    calificacion: 4,
    aprobado: true,
    activo: true,
  },
  {
    nombre: "Carlos Mendoza",
    cargo: "Contador Público",
    comentario: "Contraté el servicio de mantenimiento para 3 PCs de la oficina. Llegaron a tiempo, dejaron todo funcionando perfecto y el precio fue muy razonable.",
    calificacion: 5,
    aprobado: true,
    activo: true,
  },
  {
    nombre: "Ana Lucía Torrez",
    cargo: "Diseñadora Gráfica",
    comentario: "Tenía un problema con mi impresora que no podía resolver. Llamé por WhatsApp y al día siguiente ya estaba funcionando. Muy buena atención.",
    calificacion: 4,
    aprobado: true,
    activo: true,
  },
  {
    nombre: "Roberto Vargas",
    cargo: "Emprendedor",
    comentario: "Como dueño de un café necesitaba soporte técnico confiable. Ahora tienen mi mantenimiento mensual y mis equipos siempre funcionan bien.",
    calificacion: 5,
    aprobado: true,
    activo: true,
  },
  {
    nombre: "Laura Jiménez",
    cargo: "Abogada",
    comentario: "Excelente experiencia. Mi laptop tenía virus y pensaba que había perdido mis archivos. Recuperaron todo y la dejaron funcionando perfectamente.",
    calificacion: 4,
    aprobado: true,
    activo: true,
  },
  {
    nombre: "Diego Flores",
    cargo: "Ingeniero Civil",
    comentario: "El soporte remoto fue rápido y efectivo. Resolvieron mi problema de conectividad en 40 minutos sin necesidad de ir a la oficina. Muy práctico.",
    calificacion: 5,
    aprobado: true,
    activo: true,
  },
];
