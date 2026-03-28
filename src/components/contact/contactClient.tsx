"use client";

import { useState, useMemo } from "react";
import {
    Mail,
    MapPin,
    Clock,
    Send,
    Headphones,
    ArrowRight,
    FileText,
    Palette,
    ShieldCheck,
    UserX,
} from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/src/components/home/Header";
import { InView } from "@/src/components/home/InView";
import { fadeUp } from "@/src/lib/animations";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";
import { Footer } from "@/src/components/home/Footer";
import { myToast } from "@/src/components/ui/toast";
import { useTranslations } from "next-intl";

type Status = "idle" | "loading" | "success";

type ContactFormValues = {
    name: string;
    email: string;
    subject: string;
    message: string; 
};

const defaultValues: ContactFormValues = {
    name: "",
    email: "",
    subject: "",
    message: "",
};

export default function ContactClient() {
    const t = useTranslations("contact");
    const tToast = useTranslations("contact.toast");
    const tCommon = useTranslations("common");

    const FAQ_ITEMS = useMemo(() => {
        const raw = t.raw("faq") as { q: string; a: string }[];
        const icons = [FileText, Palette, ShieldCheck, UserX];
        const colors = [
            "text-blue-500 bg-blue-500/10",
            "text-violet-500 bg-violet-500/10",
            "text-emerald-500 bg-emerald-500/10",
            "text-rose-500 bg-rose-500/10",
        ];
        return raw.map((item, i) => ({
            ...item,
            icon: icons[i],
            color: colors[i],
        }));
    }, [t]);

    const [form, setForm] = useState<ContactFormValues>(defaultValues);
    const [status, setStatus] = useState<Status>("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error(tToast("sendError"));

            myToast.success(tToast("successTitle"), tToast("successDescription"));
            setForm(defaultValues);
            setStatus("success");
        } catch {
            myToast.error(tToast("errorTitle"), tToast("errorDescription"));
        }
    };

    const contactCards = [
        { icon: Mail, title: t("cards.email.title"), desc: t("cards.email.value"), sub: t("cards.email.hint") },
        { icon: MapPin, title: t("cards.location.title"), desc: t("cards.location.value"), sub: t("cards.location.hint") },
        { icon: Clock, title: t("cards.hours.title"), desc: t("cards.hours.value"), sub: t("cards.hours.hint") },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <section className="relative pt-28 pb-16 px-6 bg-[hsl(235,40%,14%)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(238,66%,55%,0.15),transparent_60%)]" />
                <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-4xl mx-auto text-center relative z-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        {t("heroTitle")} <span className="text-gradient">{t("heroTitleHighlight")}</span>
                    </h1>
                    <p className="text-lg text-white/60 max-w-xl mx-auto">
                        {t("heroSubtitle")}
                    </p>
                </motion.div>
            </section>

            <InView className="max-w-5xl mx-auto px-6 -mt-10 relative z-20">
                <div className="grid sm:grid-cols-3 gap-4">
                    {contactCards.map((item, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <p className="font-semibold text-foreground text-sm">{item.title}</p>
                            <p className="text-foreground mt-1">{item.desc}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
                        </motion.div>
                    ))}
                </div>
            </InView>

            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-16">
                    <InView className="lg:col-span-3">
                        <motion.div variants={fadeUp}>
                            <h2 className="text-2xl font-bold text-foreground mb-2">{t("formTitle")}</h2>
                            <p className="text-muted-foreground mb-8">
                                {t("formSubtitle")}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="name" className="text-sm font-medium text-foreground">
                                            {t("fields.fullName")}
                                        </label>
                                        <Input
                                            id="name"
                                            name="name"
                                            className="rounded-xl h-11"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder={t("fields.fullNamePlaceholder")}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                                            {t("fields.email")}
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            className="rounded-xl h-11"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder={t("fields.emailPlaceholder")}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="subject" className="text-sm font-medium text-foreground">
                                        {t("fields.subject")}
                                    </label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        className="rounded-xl h-11"
                                        value={form.subject}
                                        onChange={handleChange}
                                        placeholder={t("fields.subjectPlaceholder")}
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                                        {t("fields.message")}
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        className="rounded-xl min-h-[140px]"
                                        rows={6}
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder={t("fields.messagePlaceholder")}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="rounded-xl px-8 h-12 text-sm font-semibold gap-2"
                                >
                                    {status === "loading" ? (
                                        tCommon("sending")
                                    ) : (
                                        <>
                                            {t("submit")} <Send className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    </InView>

                    <InView className="lg:col-span-2">
                        <motion.div variants={fadeUp} className="space-y-8">
                            <div className="rounded-2xl bg-[hsl(235,40%,14%)] p-8 text-white">
                                <Headphones className="h-8 w-8 text-primary mb-4" />
                                <h3 className="text-lg font-bold mb-2">{t("supportCard.title")}</h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-4">
                                    {t("supportCard.description")}
                                </p>
                                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                                    <span>{t("supportCard.learnMore")}</span>
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border bg-card p-8">
                                <h3 className="font-bold text-foreground mb-2 text-lg">{t("faqTitle")}</h3>
                                <p className="text-xs text-muted-foreground mb-5">
                                    {t("faqHint")}
                                </p>
                                <Accordion type="single" collapsible className="w-full space-y-2.5">
                                    {FAQ_ITEMS.map((item, i) => (
                                        <AccordionItem
                                            key={i}
                                            value={`faq-${i}`}
                                            className="border border-border/60 rounded-xl px-4 overflow-hidden data-[state=open]:border-primary/30 data-[state=open]:shadow-[0_0_20px_-6px_hsl(var(--primary)/0.15)] transition-all duration-300"
                                        >
                                            <AccordionTrigger className="text-sm text-foreground/80 hover:text-foreground py-4 gap-3 hover:no-underline [&[data-state=open]]:text-foreground [&[data-state=open]]:font-semibold transition-all">
                                                <span className="flex items-center gap-3 text-left">
                                                    <span className={`h-8 w-8 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                                                        <item.icon className="h-4 w-4" />
                                                    </span>
                                                    {item.q}
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pl-11 pb-4">
                                                {item.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </motion.div>
                    </InView>
                </div>
            </section>

            <Footer />
        </div>
    );
}
