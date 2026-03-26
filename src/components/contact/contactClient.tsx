"use client";

import { useForm } from "react-hook-form";
import { myToast } from "@/src/components/ui/toast";
import { Mail, MapPin, Clock, Send, Headphones, ArrowRight, MessageCircle, FileText, Palette, ShieldCheck, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/src/components/home/Header";
import { InView } from "@/src/components/home/InView";
import { fadeUp } from "@/src/lib/animations";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";
import { Footer } from "@/src/components/home/Footer";
import { ContactFormValues } from "@/src/types/contact";

const defaultValues: ContactFormValues = {
    name: "",
    email: "",
    subject: "",
    message: "",
};

const FAQ_ITEMS = [
    { q: "Comment exporter mon CV en PDF ?", a: "Rendez-vous dans l'éditeur de votre CV, puis cliquez sur le bouton « Télécharger PDF » en haut à droite. Le fichier sera généré instantanément avec la mise en page exacte de votre aperçu.", icon: FileText, color: "text-blue-500 bg-blue-500/10" },
    { q: "Puis-je changer de modèle après ?", a: "Absolument ! Vous pouvez changer de template à tout moment depuis l'éditeur sans perdre vos informations. Tout votre contenu sera automatiquement réadapté au nouveau design.", icon: Palette, color: "text-violet-500 bg-violet-500/10" },
    { q: "Mes données sont-elles sécurisées ?", a: "Oui, toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD et ne partageons jamais vos informations avec des tiers.", icon: ShieldCheck, color: "text-emerald-500 bg-emerald-500/10" },
    { q: "Comment supprimer mon compte ?", a: "Contactez-nous via ce formulaire avec le sujet « Suppression de compte » et nous traiterons votre demande sous 48h, conformément à vos droits RGPD.", icon: UserX, color: "text-rose-500 bg-rose-500/10" },
];

export default function ContactClient() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<ContactFormValues>({ defaultValues });

    const onSubmit = async (_data: ContactFormValues) => {
        await new Promise((r) => setTimeout(r, 1000));
        myToast.success("Message envoyé avec succès !");
        reset(defaultValues);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero */}
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
                        Nous sommes là pour <span className="text-gradient">vous aider</span>
                    </h1>
                    <p className="text-lg text-white/60 max-w-xl mx-auto">
                        Une question, une suggestion ou besoin d'aide ? Notre équipe vous répond sous 24h.
                    </p>
                </motion.div>
            </section>

            {/* Quick contact cards */}
            <InView className="max-w-5xl mx-auto px-6 -mt-10 relative z-20">
                <div className="grid sm:grid-cols-3 gap-4">
                    {[
                        { icon: Mail, title: "Email", desc: "contact@cvbuilder.fr", sub: "Réponse sous 24h" },
                        { icon: MapPin, title: "Localisation", desc: "Paris, France", sub: "100% en ligne" },
                        { icon: Clock, title: "Horaires", desc: "Lun – Ven, 9h – 18h", sub: "Heure de Paris (CET)" },
                    ].map((item, i) => (
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

            {/* Form section */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-16">
                    {/* Form */}
                    <InView className="lg:col-span-3">
                        <motion.div variants={fadeUp}>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Envoyez-nous un message</h2>
                            <p className="text-muted-foreground mb-8">Remplissez le formulaire ci-dessous et nous reviendrons vers vous rapidement.</p>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-foreground">Nom complet</label>
                                        <Input className="rounded-xl h-11" {...register("name", { required: true })} placeholder="Jean Dupont" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-foreground">Email</label>
                                        <Input className="rounded-xl h-11" type="email" {...register("email", { required: true })} placeholder="jean@email.com" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground">Sujet</label>
                                    <Input className="rounded-xl h-11" {...register("subject", { required: true })} placeholder="Ex: Problème de téléchargement PDF" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground">Message</label>
                                    <Textarea className="rounded-xl min-h-[140px]" rows={6} {...register("message", { required: true })} placeholder="Décrivez votre demande en détail…" />
                                </div>
                                <Button type="submit" disabled={isSubmitting} className="rounded-xl px-8 h-12 text-sm font-semibold gap-2">
                                    {isSubmitting ? "Envoi en cours…" : (
                                        <>Envoyer le message <Send className="h-4 w-4" /></>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    </InView>

                    {/* Side info */}
                    <InView className="lg:col-span-2">
                        <motion.div variants={fadeUp} className="space-y-8">
                            <div className="rounded-2xl bg-[hsl(235,40%,14%)] p-8 text-white">
                                <Headphones className="h-8 w-8 text-primary mb-4" />
                                <h3 className="text-lg font-bold mb-2">Support prioritaire</h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-4">
                                    Besoin d'une réponse rapide ? Notre équipe traite les demandes urgentes en priorité.
                                </p>
                                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                                    <span>En savoir plus</span>
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border bg-card p-8">
                                <h3 className="font-bold text-foreground mb-2 text-lg">Questions fréquentes</h3>
                                <p className="text-xs text-muted-foreground mb-5">Cliquez sur une question pour voir la réponse</p>
                                <Accordion type="single" collapsible className="w-full space-y-2.5">
                                    {FAQ_ITEMS.map((item, i) => (
                                        <AccordionItem key={i} value={`faq-${i}`} className="border border-border/60 rounded-xl px-4 overflow-hidden data-[state=open]:border-primary/30 data-[state=open]:shadow-[0_0_20px_-6px_hsl(var(--primary)/0.15)] transition-all duration-300">
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
