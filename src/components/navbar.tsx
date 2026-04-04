"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useRef, useEffect } from "react";

const mainNavItems = [
  { label: "Overview", href: "/" },
  { label: "Methodology", href: "/methodology" },
  { label: "Results", href: "/results" },
  { label: "Model", href: "/model" },
  { label: "Team", href: "/team" },
  { label: "References", href: "/references" },
];

const moreNavItems = [
  { label: "GitHub", href: "https://github.com/febryannnn/dermadiff-website" },
  { label: "Paper", href: "#" },
  { label: "Medium Docs", href: "####" },
  { label: "Stable Diffusion 2.1", href: "https://farelfebryan06--dermadiff-sd21-generator-web-ui.modal.run" },
  { label: "Stable Diffusion XL", href: "##" },
  { label: "Stable Diffusion 3.5 Large", href: "###" },




];

const allNavItems = [...mainNavItems, ...moreNavItems];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between md:justify-center px-4 sm:px-6">

        {/* Desktop nav — pill container */}
        <nav className="hidden md:flex items-center gap-0 rounded-full border border-border/60 bg-muted/50 backdrop-blur-xl p-1.5">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-5 py-2 text-sm font-medium rounded-full transition-all duration-200",
                pathname === item.href
                  ? "bg-foreground/10 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="mx-1 h-5 w-px bg-border/60" />

          {/* More dropdown */}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className="inline-flex items-center gap-1 px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 text-muted-foreground hover:text-foreground"
            >
              More
              <svg
                width="12"
                height="12"
                viewBox="0 0 15 15"
                fill="none"
                className={cn(
                  "transition-transform duration-200",
                  moreOpen && "rotate-180"
                )}
              >
                <path
                  d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-border/60 bg-popover p-1.5 shadow-lg">
                {moreNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMoreOpen(false)}
                    className="block px-4 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors">
            <svg width="20" height="20" viewBox="0 0 15 15" fill="none">
              <path
                d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                fill="currentColor"
              />
            </svg>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="flex flex-col gap-2 mt-8">
              {allNavItems.map((item, i) => (
                <Link
                  key={`${item.href}-${i}`}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "text-foreground bg-foreground/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}