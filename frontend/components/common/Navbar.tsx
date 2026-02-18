"use client";
import Link from "next/link";
import { Container } from "../Container";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const navItems = [
    { title: "Your Clips", href: "/clips" },
    { title: "Profile", href: "/learnings" },
    { title: "Login", href: "/login" },
    { title: "Signup", href: "/signup" },
  ];

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  return (
    <div className="border-b border-neutral-300 dark:border-neutral-500/70  bg-white dark:bg-neutral-950">
      <Container>
        <div className="flex justify-end">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="border-l dark:border-neutral-500/70 border-neutral-300 last:border-r px-4 py-4 text-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-200 dark:hover:text-neutral-800 hover:bg-neutral-800 hover:text-neutral-200 transition-colors duration-300"
            >
              <span className="text-sm">{item.title}</span>
            </Link>
          ))}
          <div className="border-l dark:border-neutral-500/70  border-neutral-300 last:border-r flex items-center px-4 py-4 text-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-200 dark:hover:text-neutral-800 hover:bg-neutral-800 hover:text-neutral-200 transition-colors duration-300">
            <button className="hidden lg:block " onClick={toggleTheme}>
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5 " />
              )}
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
