-- Renombrar columna de contacto en Ticket (preserva datos): email -> whatsapp
ALTER TABLE "Ticket" RENAME COLUMN "email" TO "whatsapp";