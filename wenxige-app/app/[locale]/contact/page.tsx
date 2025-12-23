"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Contact() {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert(t("form.successMessage"));
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("form.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("form.name")}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("form.namePlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("form.email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("form.emailPlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t("form.subject")}</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t("form.subjectPlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t("form.message")}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("form.messagePlaceholder")}
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {t("form.submit")}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("info.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{t("info.email")}</p>
                    <p className="text-muted-foreground">contact@wenxige.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{t("info.phone")}</p>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{t("info.address")}</p>
                    <p className="text-muted-foreground">
                      123 Business Street<br />
                      City, State 12345
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("hours.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("hours.mondayFriday")}</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("hours.saturday")}</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("hours.sunday")}</span>
                  <span>{t("hours.closed")}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
