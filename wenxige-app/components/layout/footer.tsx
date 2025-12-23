"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Separator } from "@/components/ui/separator";

const navKeys = ["home", "about", "services", "contact"] as const;
const navPaths = ["/", "/about", "/services", "/contact"] as const;

const legalKeys = ["privacyPolicy", "termsOfService"] as const;
const legalPaths = ["/privacy", "/terms"] as const;

export function Footer() {
  const t = useTranslations("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                W
              </div>
              <span className="text-xl font-bold">Wenxige</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t("tagline")}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t("navigation")}</h3>
            <nav className="flex flex-col space-y-2">
              {navKeys.map((key, index) => (
                <Link
                  key={key}
                  href={navPaths[index]}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t(key)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t("legal")}</h3>
            <nav className="flex flex-col space-y-2">
              {legalKeys.map((key, index) => (
                <Link
                  key={key}
                  href={legalPaths[index]}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t(key)}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {currentYear} Wenxige. {t("allRightsReserved")}</p>
          <p className="text-xs">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
