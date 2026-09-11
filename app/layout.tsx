import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BrandStyle from "@/components/brand-style";
import { SettingsProvider } from "@/lib/settings-context";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("")}`;
}

function mixColor(hex: string, pct: number, mixWith: string = "#ffffff") {
  const a = hexToRgb(hex);
  const b = hexToRgb(mixWith);
  return rgbToHex(
    a.r + (b.r - a.r) * pct,
    a.g + (b.g - a.g) * pct,
    a.b + (b.b - a.b) * pct,
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await db.systemSettings.findUnique({ where: { id: "system-config" } });
  const name = settings?.institutionName || "Soportik";
  return {
    title: `${name} – Soporte Técnico de Computadoras`,
    description: `Servicio de soporte técnico y mantenimiento de computadoras en El Alto – La Paz, Bolivia.`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await cookies();
  const settings = await db.systemSettings.findUnique({ where: { id: "system-config" } });
  const p = settings?.primaryColor || "#1a3a5c";
  const s = settings?.secondaryColor || "#2e7dc4";
  const brandLight = mixColor(s, 0.2, "#ffffff");
  const secondaryLight = mixColor(s, 0.85, "#ffffff");
  const darkPrimary = mixColor(p, 0.35, "#8ab4f8");
  const darkSecondary = mixColor(s, 0.8, "#0f172a");
  const darkSecondaryFg = mixColor(s, 0.15, "#ffffff");
  const darkRing = mixColor(s, 0.2, "#8ab4f8");
  const darkSidebarPrimary = mixColor(p, 0.35, "#8ab4f8");

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <style>{`
          :root {
            --brand-primary: ${p};
            --brand-secondary: ${s};
            --brand-dark: ${p};
            --brand-accent: ${s};
            --brand-light: ${brandLight};

            --primary: ${p};
            --primary-foreground: #ffffff;
            --secondary: ${secondaryLight};
            --secondary-foreground: ${s};
            --accent: ${s};
            --accent-foreground: #ffffff;
            --ring: ${s};
            --sidebar-primary: ${p};
            --sidebar-primary-foreground: #ffffff;
          }
          .dark {
            --brand-dark: #0f172a;
            --brand-accent: ${s};
            --brand-light: ${brandLight};

            --primary: ${darkPrimary};
            --primary-foreground: #ffffff;
            --secondary: ${darkSecondary};
            --secondary-foreground: ${darkSecondaryFg};
            --accent: ${s};
            --accent-foreground: #ffffff;
            --ring: ${darkRing};
            --sidebar-primary: ${darkSidebarPrimary};
            --sidebar-primary-foreground: #ffffff;
            --sidebar-ring: ${darkRing};
          }
        `}</style>
        {settings?.logoUrl && (
          <link rel="icon" href={settings.logoUrl} />
        )}
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <SettingsProvider
          settings={
            settings
              ? {
                  institutionName: settings.institutionName,
                  logoUrl: settings.logoUrl,
                  primaryColor: settings.primaryColor,
                  secondaryColor: settings.secondaryColor,
                  isConfigured: settings.isConfigured,
                }
              : null
          }
        >
          {children}
          <BrandStyle primaryColor={p} secondaryColor={s} />
        </SettingsProvider>
      </body>
    </html>
  );
}
