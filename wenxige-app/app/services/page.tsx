import { Code, Palette, TrendingUp, Shield, Users, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description:
      "Custom web applications built with modern technologies to meet your unique business needs.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Beautiful, intuitive interfaces that enhance user experience and drive engagement.",
  },
  {
    icon: TrendingUp,
    title: "Digital Marketing",
    description:
      "Strategic marketing solutions to increase your online presence and grow your audience.",
  },
  {
    icon: Shield,
    title: "Security Solutions",
    description:
      "Comprehensive security measures to protect your digital assets and customer data.",
  },
  {
    icon: Users,
    title: "Consulting",
    description:
      "Expert guidance to help you navigate digital transformation and optimize your operations.",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description:
      "Speed up your applications and improve efficiency for better user satisfaction.",
  },
];

export default function Services() {
  return (
    <div className="flex flex-col">
      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="space-y-4 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Our Services
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            We offer a comprehensive range of services to help your business thrive
            in the digital age.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <service.icon className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Contact us today to discuss how we can help transform your business.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
