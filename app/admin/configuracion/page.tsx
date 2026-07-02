"use client";

import { useState, useEffect } from "react";
import { getSettings, updateSystemSettings } from "@/lib/actions/settings-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, ImageOff, ExternalLink, Check } from "lucide-react";

const PALETTES = [
  {
    name: "Azul Institucional",
    desc: "Clásico corporativo azul marino",
    primary: "#1a3a5c",
    secondary: "#2e7dc4",
  },
  {
    name: "Pizarra & Índigo",
    desc: "Moderno slate con acento índigo",
    primary: "#334155",
    secondary: "#6366f1",
  },
  {
    name: "Tech Oscuro",
    desc: "Oscuro elegante con azul brillante",
    primary: "#0f172a",
    secondary: "#3b82f6",
  },
  {
    name: "Esmeralda",
    desc: "Verde institucional fresco",
    primary: "#064e3b",
    secondary: "#059669",
  },
];

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
function mixColor(hex: string, pct: number, mixWith = "#ffffff") {
  const a = hexToRgb(hex);
  const b = hexToRgb(mixWith);
  return rgbToHex(a.r + (b.r - a.r) * pct, a.g + (b.g - a.g) * pct, a.b + (b.b - a.b) * pct);
}

export default function ConfiguracionPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreviewError, setLogoPreviewError] = useState(false);

  useEffect(() => {
    getSettings().then((data) => {
      const s = data || { institutionName: "SoportePro", primaryColor: "#1a3a5c", secondaryColor: "#2e7dc4" };
      setSettings(s);
      setLoading(false);
      applyColors(s.primaryColor, s.secondaryColor);
    });
  }, []);

  function applyColors(p: string, s: string) {
    const root = document.documentElement;
    const brandLight = mixColor(s, 0.2, "#ffffff");
    const secondaryLight = mixColor(s, 0.85, "#ffffff");
    const darkPrimary = mixColor(p, 0.35, "#8ab4f8");
    const darkSecondary = mixColor(s, 0.8, "#0f172a");
    const darkSecondaryFg = mixColor(s, 0.15, "#ffffff");
    const darkRing = mixColor(s, 0.2, "#8ab4f8");
    const darkSidebarPrimary = mixColor(p, 0.35, "#8ab4f8");

    root.style.setProperty("--brand-primary", p);
    root.style.setProperty("--brand-secondary", s);
    root.style.setProperty("--brand-dark", p);
    root.style.setProperty("--brand-accent", s);
    root.style.setProperty("--brand-light", brandLight);
    root.style.setProperty("--primary", p);
    root.style.setProperty("--primary-foreground", "#ffffff");
    root.style.setProperty("--secondary", secondaryLight);
    root.style.setProperty("--secondary-foreground", s);
    root.style.setProperty("--accent", s);
    root.style.setProperty("--accent-foreground", "#ffffff");
    root.style.setProperty("--ring", s);
    root.style.setProperty("--sidebar-primary", p);
    root.style.setProperty("--sidebar-primary-foreground", "#ffffff");
  }

  const handleChange = (key: string, value: string) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    if (key === "primaryColor" || key === "secondaryColor") {
      applyColors(
        key === "primaryColor" ? value : next.primaryColor,
        key === "secondaryColor" ? value : next.secondaryColor
      );
    }
  };

  const selectPalette = (palette: typeof PALETTES[number]) => {
    const next = { ...settings, primaryColor: palette.primary, secondaryColor: palette.secondary };
    setSettings(next);
    applyColors(palette.primary, palette.secondary);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updateSystemSettings({
        institutionName: settings.institutionName,
        logoUrl: settings.logoUrl || null,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
      });
      setLogoPreviewError(false);
      toast.success("Configuración guardada — los cambios se reflejan automáticamente en todo el sistema");
    } catch {
      toast.error("Error al guardar");
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground animate-pulse">Cargando...</div>;

  const hasLogo = settings?.logoUrl && !logoPreviewError;
  const activePalette = PALETTES.find(
    (p) => p.primary === settings?.primaryColor && p.secondary === settings?.secondaryColor
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configuración institucional del sistema — los cambios se aplican en tiempo real
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre de la Institución</Label>
          <Input
            id="name"
            value={settings?.institutionName || ""}
            onChange={(e) => handleChange("institutionName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo">URL del Logo</Label>
          <Input
            id="logo"
            value={settings?.logoUrl || ""}
            onChange={(e) => {
              handleChange("logoUrl", e.target.value);
              setLogoPreviewError(false);
            }}
            placeholder="https://ejemplo.com/logo.png"
          />
          {settings?.logoUrl && (
            <div className="flex items-center gap-3 mt-2 p-3 rounded-lg border bg-muted/30">
              {hasLogo ? (
                <img
                  src={settings.logoUrl}
                  alt="Vista previa del logo"
                  className="h-10 w-auto object-contain rounded"
                  onError={() => setLogoPreviewError(true)}
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <ImageOff className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                {hasLogo ? (
                  <span className="text-green-600 dark:text-green-400">Logo cargado correctamente</span>
                ) : (
                  <span>No se pudo cargar la imagen. Verifica la URL.</span>
                )}
              </div>
              {hasLogo && (
                <a href={settings.logoUrl} target="_blank" rel="noopener noreferrer" className="ml-auto">
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary">Color Primario</Label>
            <div className="flex gap-2">
              <Input
                id="primary"
                type="color"
                value={settings?.primaryColor || "#1a3a5c"}
                onChange={(e) => handleChange("primaryColor", e.target.value)}
                className="w-12 p-1"
              />
              <Input
                value={settings?.primaryColor || ""}
                onChange={(e) => handleChange("primaryColor", e.target.value)}
                className="flex-1 font-mono"
              />
            </div>
            <p className="text-xs text-muted-foreground">Botones principales, sidebar, encabezados</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondary">Color Secundario</Label>
            <div className="flex gap-2">
              <Input
                id="secondary"
                type="color"
                value={settings?.secondaryColor || "#2e7dc4"}
                onChange={(e) => handleChange("secondaryColor", e.target.value)}
                className="w-12 p-1"
              />
              <Input
                value={settings?.secondaryColor || ""}
                onChange={(e) => handleChange("secondaryColor", e.target.value)}
                className="flex-1 font-mono"
              />
            </div>
            <p className="text-xs text-muted-foreground">Acentos, badges, bordes de focus</p>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Paletas Profesionales</Label>
          <div className="grid grid-cols-2 gap-3">
            {PALETTES.map((palette) => {
              const isActive = palette === activePalette;
              return (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => selectPalette(palette)}
                  className={cn(
                    "relative rounded-xl border p-3 text-left transition-all hover:shadow-md",
                    isActive ? "hover:border-muted-foreground/30" : "hover:border-muted-foreground/30"
                  )}
                  style={{
                    borderColor: isActive ? palette.secondary : undefined,
                    boxShadow: isActive ? `0 0 0 2px ${palette.secondary}` : undefined,
                  }}
                >
                  {isActive && (
                    <div
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: palette.secondary }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="flex gap-1.5 mb-2">
                    <div
                      className="w-6 h-6 rounded-md"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <div
                      className="w-6 h-6 rounded-md"
                      style={{ backgroundColor: palette.secondary }}
                    />
                  </div>
                  <p className="text-sm font-medium">{palette.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{palette.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Guardando..." : "Guardar Configuración"}
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h3 className="font-semibold">Vista Previa — Sistema Completo</h3>

        {/* Navbar preview */}
        <div className="rounded-lg overflow-hidden border">
          <div className="flex items-center gap-3 p-4" style={{ backgroundColor: "var(--brand-primary)" }}>
            {hasLogo ? (
              <img src={settings.logoUrl} alt="Logo" className="h-9 w-auto object-contain rounded" />
            ) : (
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--brand-secondary)" }}>
                <span className="text-white font-bold text-xs">SP</span>
              </div>
            )}
            <span className="text-white font-bold text-sm">
              {settings?.institutionName || "SoportePro"}
            </span>
            <div className="ml-auto">
              <div className="h-7 rounded-md px-3 flex items-center text-xs font-medium text-white" style={{ backgroundColor: "var(--brand-secondary)" }}>
                Botón CTA
              </div>
            </div>
          </div>
        </div>

        {/* Component previews */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Botones</p>
            <div className="flex flex-wrap gap-2">
              <button className="h-8 rounded-md px-4 text-xs font-medium text-white" style={{ backgroundColor: "var(--brand-primary)" }}>
                Primario
              </button>
              <button className="h-8 rounded-md px-4 text-xs font-medium" style={{ backgroundColor: "transparent", color: "var(--brand-secondary)", border: "1px solid var(--brand-secondary)" }}>
                Secundario
              </button>
            </div>
          </div>
          <div className="rounded-lg border p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Badges</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: "var(--brand-primary)" }}>
                Admin
              </span>
              <span className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: "var(--brand-secondary)" }}>
                Técnico
              </span>
            </div>
          </div>
          <div className="rounded-lg border p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sidebar</p>
            <div className="flex items-center gap-2 p-2 rounded-md text-xs font-medium text-white" style={{ backgroundColor: "var(--brand-primary)" }}>
              <div className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: "var(--brand-secondary)" }} />
              Dashboard
            </div>
          </div>
          <div className="rounded-lg border p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Focus Ring</p>
            <input
              readOnly
              className="w-full h-8 rounded-md border px-2 text-xs"
              style={{ borderColor: "var(--brand-secondary)", outline: "2px solid var(--brand-secondary)", outlineOffset: "2px" }}
              placeholder="Input con focus"
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Vista previa en vivo — los colores cambian al instante al seleccionar una paleta o ajustar los selectores.
        </p>
      </div>
    </div>
  );
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
