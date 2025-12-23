import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("home");
  const stats = useTranslations("home.stats");

  return (
    <div className="flex flex-col">
      <section className="container mx-auto max-w-6xl px-4 py-24 md:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {t("hero.title")}{" "}
            <span className="text-primary">{t("hero.brand")}</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/services">
                {t("cta.ourServices")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">{t("cta.contactUs")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-bold">100+</h3>
              <p className="text-muted-foreground">{stats("projectsCompleted")}</p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-bold">50+</h3>
              <p className="text-muted-foreground">{stats("happyClients")}</p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-bold">5+</h3>
              <p className="text-muted-foreground">{stats("yearsExperience")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
