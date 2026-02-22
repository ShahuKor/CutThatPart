"use client";

import { usePathname } from "next/navigation";
import Navbar from "./common/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  if (pathname?.startsWith("/clip/")) {
    return null;
  }

  return <Navbar />;
}
