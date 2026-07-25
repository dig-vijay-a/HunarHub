"use client";

import { UIProvider } from "@/context/UIContext";
import { ReactNode } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <UIProvider>{children}</UIProvider>;
}
