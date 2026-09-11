"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

export interface Settings {
  institutionName: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  isConfigured: boolean;
}

const DEFAULT: Settings = {
  institutionName: "Soportik",
  logoUrl: null,
  primaryColor: "#1a3a5c",
  secondaryColor: "#2e7dc4",
  isConfigured: false,
};

const SettingsContext = createContext<Settings>(DEFAULT);

export function SettingsProvider({
  children,
  settings,
}: {
  children: ReactNode;
  settings: Settings | null;
}) {
  const value = useMemo(() => settings ?? DEFAULT, [settings]);
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): Settings {
  return useContext(SettingsContext);
}
