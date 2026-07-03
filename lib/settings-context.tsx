"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface Settings {
  institutionName: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  isConfigured: boolean;
}

const DEFAULT: Settings = {
  institutionName: "SoportePro",
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
  return (
    <SettingsContext.Provider value={settings ?? DEFAULT}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): Settings {
  return useContext(SettingsContext);
}
