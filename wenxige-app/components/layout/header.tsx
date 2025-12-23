"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { cn } from "@/lib/utils";

const navKeys = ["home", "about", "services", "contact"] as const;
const navPaths = ["/", "/about", "/services", "/contact"] as const;

export function Header() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            W
          </div>
          <span className="text-xl font-bold">Wenxige</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navKeys.map((key, index) => (
            <Link
              key={key}
              href={navPaths[index]}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === navPaths[index]
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40">
          <nav className="container mx-auto flex flex-col space-y-4 px-4 py-4">
            {navKeys.map((key, index) => (
              <Link
                key={key}
                href={navPaths[index]}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === navPaths[index]
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {t(key)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
