"use client";
import Link from "next/link";
import { Container } from "../Container";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignOutButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const linkClass =
    "border-l dark:border-neutral-500/70 border-neutral-300 last:border-r px-4 py-4 text-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-200 dark:hover:text-neutral-800 hover:bg-neutral-800 hover:text-neutral-200 transition-colors duration-300";

  const mobileLinkClass =
    "w-full text-center px-6 py-4 text-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-200 dark:hover:text-neutral-800 hover:bg-neutral-800 hover:text-neutral-200 transition-colors duration-300  dark:border-neutral-500/70 border-neutral-300";

  return (
    <>
      <div className="border-b border-neutral-300 dark:border-neutral-500/70 bg-white dark:bg-neutral-950">
        <Container>
          <div className="flex justify-end md:justify-between h-15">
            {/* Desktop Nav */}
            <SignedIn>
              <div className="hidden md:flex border-l border-r dark:border-neutral-500/70 border-neutral-300 last:border-r px-4 py-4 text-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-200 dark:hover:text-neutral-800 hover:bg-neutral-800 hover:text-neutral-200 transition-colors duration-300">
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <div></div>
            </SignedOut>

            <div className="hidden md:flex">
              <SignedIn>
                <Link href="/dashboard" className={linkClass}>
                  <span className="text-sm">Your Clips</span>
                </Link>

                <div className={linkClass}>
                  <span className="text-sm">
                    <SignOutButton />
                  </span>
                </div>
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
                className="border-l dark:border-neutral-500/70 border-neutral-300 last:border-r flex items-center px-4 py-4 text-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-200 dark:hover:text-neutral-800 hover:bg-neutral-800 hover:text-neutral-200 transition-colors duration-300"
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

            {/* Mobile: theme toggle + hamburger */}
            <div className="flex md:hidden items-center">
              <button
                className="border-l dark:border-neutral-500/70 border-neutral-300 flex items-center px-4 py-4 text-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-200 dark:hover:text-neutral-800 hover:bg-neutral-800 hover:text-neutral-200 transition-colors duration-300"
                onClick={toggleTheme}
              >
                {mounted &&
                  (theme === "light" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  ))}
              </button>
              <button
                className="border-l border-r dark:border-neutral-500/70 border-neutral-300 flex items-center px-4 py-4 text-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-200 dark:hover:text-neutral-800 hover:bg-neutral-800 hover:text-neutral-200 transition-colors duration-300"
                onClick={() => setMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-neutral-950 md:hidden">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 p-2 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors duration-300"
            onClick={() => setMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex flex-col items-center w-full  dark:border-neutral-500/70 border-neutral-300">
            <SignedIn>
              <Link
                href="/dashboard"
                className={mobileLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-sm">Your Clips</span>
              </Link>
              <Link
                href="/dashboard"
                className={mobileLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-sm">
                  <SignOutButton />
                </span>
              </Link>

              <div className="w-full flex justify-center px-6 py-4  dark:border-neutral-500/70 border-neutral-300">
                <UserButton />
              </div>
            </SignedIn>

            <SignedOut>
              <Link
                href="/sign-in"
                className={mobileLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-sm">Login</span>
              </Link>
              <Link
                href="/sign-up"
                className={mobileLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-sm">Signup</span>
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </>
  );
}
