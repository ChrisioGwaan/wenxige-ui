import { Target, Eye, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function About({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("about");

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

        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t("story.title")}</h2>
            <p className="text-muted-foreground">
              {t("story.paragraph1")}
            </p>
            <p className="text-muted-foreground">
              {t("story.paragraph2")}
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg aspect-video flex items-center justify-center">
            <span className="text-muted-foreground">{t("companyImage")}</span>
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h2 className="text-2xl font-bold text-center mb-12">
            {t("values.title")}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Target className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{t("values.mission.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("values.mission.description")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Eye className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{t("values.vision.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("values.vision.description")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{t("values.values.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("values.values.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
