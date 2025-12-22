import { Target, Eye, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="flex flex-col">
      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="space-y-4 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            About Us
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Learn more about who we are and what drives us forward.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Our Story</h2>
            <p className="text-muted-foreground">
              Wenxige was founded with a simple mission: to deliver exceptional
              results through innovation and dedication. Over the years, we have
              grown from a small team into a trusted partner for businesses across
              various industries.
            </p>
            <p className="text-muted-foreground">
              Our team of experts brings together diverse skills and perspectives,
              allowing us to tackle complex challenges and deliver solutions that
              exceed expectations. We believe in building lasting relationships
              with our clients based on trust, transparency, and mutual success.
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg aspect-video flex items-center justify-center">
            <span className="text-muted-foreground">Company Image</span>
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h2 className="text-2xl font-bold text-center mb-12">
            Our Values
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Target className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To empower businesses with innovative solutions that drive
                  growth and create lasting value for all stakeholders.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Eye className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To be the leading partner of choice for businesses seeking
                  excellence, innovation, and sustainable growth.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Integrity, innovation, collaboration, and commitment to
                  excellence guide everything we do.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
