"use client";

import type { ReactNode, CSSProperties } from "react";

export const SERVICIO_PRESELECT_EVENT = "soporte:preselect-servicio";

export function PreselectLink({
  nombre,
  className,
  style,
  children,
}: {
  nombre: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <a
      href="#formulario"
      className={className}
      style={style}
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent(SERVICIO_PRESELECT_EVENT, { detail: { nombre } })
        )
      }
    >
      {children}
    </a>
  );
}