import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const adminExists = await db.user.findUnique({ where: { email: "admin@soportik.com" } });
  if (adminExists) {
    console.log("Admin ya existe. Seed omitido.");
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

  await db.systemSettings.create({
    data: {
      id: "system-config",
      institutionName: "Soportik",
      primaryColor: "#1a3a5c",
      secondaryColor: "#2e7dc4",
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
      email: "tik.soporte@gmail.com",
      nombre: "Juan Pérez Mamani",
      estado: "EN_PROCESO",
      tecnicoId: tecnico.id,
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