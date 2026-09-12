import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const SERVICIOS = [
  { nombre: "Mantenimiento de PC", descripcion: "Limpieza, optimización y revisión general de equipos de escritorio.", duracion: "2-3 horas", precioBs: 80, popular: true, orden: 1 },
  { nombre: "Mantenimiento de laptop", descripcion: "Revisión y mantenimiento completo de computadoras portátiles.", duracion: "2-4 horas", precioBs: 90, popular: true, orden: 2 },
  { nombre: "Limpieza interna", descripcion: "Limpieza de los componentes internos y externos del equipo.", duracion: "1-2 horas", precioBs: 60, popular: false, orden: 3 },
  { nombre: "Cambio de pasta térmica", descripcion: "Reemplazo de pasta térmica y revisión del sistema de ventilación.", duracion: "1 hora", precioBs: 70, popular: false, orden: 4 },
  { nombre: "Optimización de Windows", descripcion: "Actualización, limpieza y ajuste del sistema operativo Windows.", duracion: "1-2 horas", precioBs: 60, popular: false, orden: 5 },
  { nombre: "Liberación de espacio", descripcion: "Eliminación de archivos temporales y optimización del almacenamiento.", duracion: "1 hora", precioBs: 50, popular: false, orden: 6 },
  { nombre: "Instalación de software", descripcion: "Instalación y configuración de aplicaciones y programas.", duracion: "1-3 horas", precioBs: 50, popular: false, orden: 7 },
  { nombre: "Impresoras", descripcion: "Mantenimiento y reparación de impresoras de inyección y láser.", duracion: "1-2 horas", precioBs: 90, popular: true, orden: 8 },
  { nombre: "Wi-Fi / redes", descripcion: "Configuración y solución de problemas de redes inalámbricas y cableadas.", duracion: "1-2 horas", precioBs: 80, popular: false, orden: 9 },
  { nombre: "Recuperación de acceso", descripcion: "Recuperación de contraseñas y accesos autorizados del equipo.", duracion: "30 min - 1 hora", precioBs: 60, popular: false, orden: 10 },
  { nombre: "Soporte remoto", descripcion: "Asistencia y solución de problemas técnicos a distancia.", duracion: "30 min - 1 hora", precioBs: 40, popular: true, orden: 11 },
  { nombre: "Soporte a domicilio", descripcion: "Atención técnica en el domicilio u oficina del cliente.", duracion: "Variable", precioBs: 120, popular: false, orden: 12 },
  { nombre: "Soporte para negocios", descripcion: "Soporte continuo y prioritario para pequeños negocios con múltiples equipos.", duracion: "Mensual", precioBs: 300, popular: false, orden: 13 },
];

async function seedServicios() {
  let count = 0;
  for (const s of SERVICIOS) {
    await db.servicio.upsert({
      where: { nombre: s.nombre },
      update: {
        descripcion: s.descripcion,
        duracion: s.duracion,
        precioBs: s.precioBs,
        popular: s.popular,
        activo: true,
      },
      create: { ...s, activo: true },
    });
    count++;
  }
  console.log(`✅ Tarifario sincronizado: ${count} servicios.`);
}

async function main() {
  await seedServicios();

  const adminExists = await db.user.findUnique({ where: { email: "admin@soportik.com" } });
  if (adminExists) {
    console.log("Admin ya existe. Datos de demostración omitidos.");
    return;
  }

  const adminPassword = await bcrypt.hash("admin123", 10);

  const admin = await db.user.create({
    data: {
      name: "Admin Principal",
      email: "admin@soportik.com",
      password: adminPassword,
      role: "ADMIN",
      isActive: true,
    },
  });

  const tecPassword = await bcrypt.hash("tecnico123", 10);
  const tecnico = await db.user.create({
    data: {
      name: "Técnico Demo",
      email: "tecnico@soportik.com",
      password: tecPassword,
      role: "TECNICO",
      isActive: true,
    },
  });

  await db.systemSettings.upsert({
    where: { id: "system-config" },
    update: { isConfigured: true },
    create: {
      id: "system-config",
      institutionName: "Soportik",
      primaryColor: "#1a3a5c",
      secondaryColor: "#2e7dc4",
      cambioUsd: 6.97,
      isConfigured: true,
    },
  });

  const cl = await db.cliente.create({
    data: {
      nombre: "Juan Pérez Mamani",
      cargo: "Personal",
      dependencia: "Zota C. #425, Z. Villa Exaltación",
      area: "Satélite",
      telefono: "76259553",
    },
  });

  const eq1 = await db.equipo.create({
    data: {
      tipo: "SCANNER",
      nombre: "ESCANER HP SCANJET N6350",
      marca: "HP",
      modelo: "SCANJET N6350",
      numeroActivo: "15090066",
      numeroSerie: "CN4B4EE05V",
      clienteId: cl.id,
    },
  });

  const eq2 = await db.equipo.create({
    data: {
      tipo: "IMPRESORA",
      nombre: "IMPRESORA HP LJ ENTERPRISE M506",
      marca: "HP",
      modelo: "LJ ENTERPRISE M506",
      numeroActivo: "15130529",
      numeroSerie: "BRBSK3P5RC",
      clienteId: cl.id,
    },
  });

  await db.diagnostico.create({
    data: {
      numeroFicha: 1,
      tipo: "PREVENTIVO",
      diagnostico: "SE REALIZÓ EL MANTENIMIENTO PREVENTIVO DE SCANNERS, LIMPIEZA DE LOS COMPONENTES INTERNOS Y EXTERNOS, Y LOS SCANNERS ESTÁN EN CORRECTO FUNCIONAMIENTO.",
      trabajoRealizado: "MANTENIMIENTO PREVENTIVO",
      equipoId: eq1.id,
      tecnicoId: admin.id,
    },
  });

  await db.diagnostico.create({
    data: {
      numeroFicha: 2,
      tipo: "PREVENTIVO",
      descripcionFc: "EL EQUIPO FUNCIONA CORRECTAMENTE.",
      diagnostico: "EQUIPO OPERATIVO, PREVER KIT DE RODILLOS ALIMENTACIÓN Y SEPARADOR DE HOJAS.",
      trabajoRealizado: "MANTENIMIENTO PREVENTIVO",
      equipoId: eq2.id,
      tecnicoId: tecnico.id,
    },
  });

  const ticket = await db.ticket.create({
    data: {
      code: "TK-DEMO-001",
      title: "Problema con escáner no enciende",
      categoria: "Hardware",
      descripcion: "El escáner no enciende desde ayer. Se requiere revisión técnica urgente.",
      whatsapp: "76259553",
      nombre: "Juan Pérez Mamani",
      estado: "EN_PROCESO",
      tecnicoId: tecnico.id,
      clienteId: cl.id,
    },
  });

  await db.ticketEvento.create({
    data: {
      ticketId: ticket.id,
      evento: "CREADO",
      comentario: "Ticket creado por el cliente",
      tecnico: "Sistema",
    },
  });

  await db.ticketEvento.create({
    data: {
      ticketId: ticket.id,
      evento: "EN_PROCESO",
      comentario: "Asignado a Técnico Demo",
      tecnico: "Admin Principal",
    },
  });

  console.log("✅ Seed completado exitosamente.");
  console.log(`   Admin: admin@soportik.com / admin123`);
  console.log(`   Técnico: tecnico@soportik.com / tecnico123`);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });