import { Code, Palette, TrendingUp, Shield, Users, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

const serviceIcons = {
  webDevelopment: Code,
  uiuxDesign: Palette,
  digitalMarketing: TrendingUp,
  securitySolutions: Shield,
  consulting: Users,
  performanceOptimization: Zap,
};

const serviceKeys = [
  "webDevelopment",
  "uiuxDesign",
  "digitalMarketing",
  "securitySolutions",
  "consulting",
  "performanceOptimization",
] as const;

export default async function Services({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ServicesContent />;
}

function ServicesContent() {
  const t = useTranslations("services");

  return (
    <div className="flex flex-col">
      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="space-y-4 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {serviceKeys.map((key) => {
            const Icon = serviceIcons[key];
            return (
              <Card key={key} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle>{t(`items.${key}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {t(`items.${key}.description`)}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {t("cta.subtitle")}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t("cta.button")}
          </Link>
        </div>
      </section>
    </div>
  );
}
