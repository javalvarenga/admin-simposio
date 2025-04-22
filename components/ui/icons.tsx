// src/components/icons/Icons.tsx

import * as React from "react";
import { cn } from "@/lib/utils";

// Ícono para "Kit entregado" (check)
export const KitEntregadoIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={cn("h-5 w-5 text-green-600", className)}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
);
KitEntregadoIcon.displayName = "KitEntregadoIcon";

// Ícono para "Kit no entregado" (cancel or cross)
export const KitNoEntregadoIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={cn("h-5 w-5 text-red-600", className)}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
);
KitNoEntregadoIcon.displayName = "KitNoEntregadoIcon";
