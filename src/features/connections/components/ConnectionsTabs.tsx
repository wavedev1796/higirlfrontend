"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Link2, UserRoundPlus } from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";

const TABS = [
  { href: ROUTES.REQUESTS, label: "Solicitudes", Icon: UserRoundPlus },
  { href: ROUTES.CONNECTIONS, label: "Mis conexiones", Icon: Link2 },
];

export function ConnectionsTabs() {
  const pathname = usePathname();

  return (
    <nav className="connections-tabs" aria-label="Secciones de conexiones">
      {TABS.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          className={pathname === href ? "active" : ""}
        >
          <Icon size={17} aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  );
}
