import type { ReactNode } from "react";

export interface IconDef {
  id: string;
  label: string;
  icon: ReactNode;
  onDoubleClick: () => void;
}
