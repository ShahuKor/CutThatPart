"use client";
import Link from "next/link";
import { Container } from "../Container";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const linkClass =
    "border-l dark:border-neutral-500/70 border-neutral-300 last:border-r px-4 py-4 text-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-200 dark:hover:text-neutral-800 hover:bg-neutral-800 hover:text-neutral-200 transition-colors duration-300";

  return (
    <div className="border-b border-neutral-300 dark:border-neutral-500/70 bg-white dark:bg-neutral-950">
      <Container>
        <div className="flex justify-end">
          <SignedIn>
            <Link href="/clips" className={linkClass}>
              <span className="text-sm">Your Clips</span>
            </Link>
            <Link href="/profile" className={linkClass}>
              <span className="text-sm">Profile</span>
            </Link>
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in" className={linkClass}>
              <span className="text-sm">Login</span>
            </Link>
            <Link href="/sign-up" className={linkClass}>
              <span className="text-sm">Signup</span>
            </Link>
          </SignedOut>

          <button
            className="border-l dark:border-neutral-500/70 border-neutral-300 last:border-r flex items-center px-4 py-4 text-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-200 dark:hover:text-neutral-800 hover:bg-neutral-800 hover:text-neutral-200 transition-colors duration-300 hidden lg:block"
            onClick={toggleTheme}
          >
            {mounted &&
              (theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              ))}
          </button>
        </div>
      </Container>
    </div>
  );
}
