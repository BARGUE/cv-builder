"use client";

import { Header } from "@/src/components/home/Header";
import { Footer } from "@/src/components/home/Footer";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/src/lib/animations";
import { InView } from "@/src/components/home/InView";
import { FileText, ShieldCheck, CreditCard, Scale, BookOpen, UserCheck, AlertTriangle, Gavel, Globe } from "lucide-react";

const sections = [
    {
        icon: BookOpen,
        title: "1. Objet",
        content: "Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre CVBuilder (ci-après « le Service ») et toute personne physique ou morale (ci-après « l'Utilisateur ») souhaitant utiliser les services proposés sur le site cvbuilder.fr."
    },
    {
        icon: FileText,
        title: "2. Services proposés",
        content: "CVBuilder propose un service en ligne de création, édition et téléchargement de curriculum vitae. Les fonctionnalités incluent la saisie d'informations personnelles, le choix de modèles, la personnalisation graphique et l'export au format PDF."
    },
    {
        icon: UserCheck,
        title: "3. Inscription et compte utilisateur",
        content: "L'accès aux services nécessite la création d'un compte. L'Utilisateur s'engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants de connexion. Toute utilisation du compte est réputée effectuée par l'Utilisateur."
    },
    {
        icon: CreditCard,
        title: "4. Tarifs et paiement",
        content: "Les tarifs des services sont indiqués en euros toutes taxes comprises (TTC). Le paiement s'effectue en ligne par les moyens de paiement acceptés sur la plateforme. CVBuilder se réserve le droit de modifier ses tarifs à tout moment, les nouvelles conditions tarifaires s'appliquant aux commandes passées postérieurement à la modification."
    },
    {
        icon: AlertTriangle,
        title: "5. Droit de rétractation",
        content: "Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contrats de fourniture de contenu numérique non fourni sur un support matériel dont l'exécution a commencé avec l'accord préalable exprès du consommateur."
    },
    {
        icon: ShieldCheck,
        title: "6. Propriété intellectuelle",
        content: "L'ensemble des éléments du site (design, textes, images, logiciels) sont protégés par le droit de la propriété intellectuelle. Les CV créés par les utilisateurs restent leur propriété. CVBuilder conserve la propriété de ses modèles et de sa technologie."
    },
    {
        icon: Scale,
        title: "7. Responsabilité",
        content: "CVBuilder s'engage à mettre en œuvre tous les moyens nécessaires pour assurer la continuité et la qualité du service. Toutefois, CVBuilder ne saurait être tenu responsable des interruptions de service, des pertes de données ou de tout dommage indirect résultant de l'utilisation du service."
    },
    {
        icon: Gavel,
        title: "8. Résiliation",
        content: "L'Utilisateur peut résilier son compte à tout moment depuis son espace personnel. CVBuilder se réserve le droit de suspendre ou résilier un compte en cas de manquement aux présentes CGV."
    },
    {
        icon: Globe,
        title: "9. Droit applicable",
        content: "Les présentes CGV sont soumises au droit français. Tout litige relatif à leur interprétation ou exécution relève de la compétence des tribunaux français."
    },
];

export default function TermsClient() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero */}
            <section className="relative pt-28 pb-16 px-6 bg-[hsl(235,40%,14%)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(238,66%,55%,0.12),transparent_60%)]" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-4xl mx-auto text-center relative z-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Conditions générales <span className="text-gradient">de vente</span>
                    </h1>
                    <p className="text-lg text-white/60 max-w-xl mx-auto">
                        Dernière mise à jour : 12 mars 2026
                    </p>
                </motion.div>
            </section>

            {/* Content blocks */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    {sections.map((section, i) => (
                        <InView key={i}>
                            <motion.div
                                variants={fadeUp}
                                className="rounded-2xl border border-border bg-card p-6 md:p-8 hover:shadow-md transition-shadow group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <section.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground mb-2">{section.title}</h2>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </InView>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <InView>
                <motion.section variants={fadeUp} className="py-12 px-6">
                    <div className="max-w-3xl mx-auto rounded-2xl bg-[hsl(235,40%,14%)] p-8 md:p-12 text-center">
                        <h3 className="text-xl font-bold text-white mb-2">Des questions sur nos conditions ?</h3>
                        <p className="text-white/60 text-sm mb-6">Notre équipe est disponible pour répondre à toutes vos interrogations.</p>
                        <a href="/contact" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                            Nous contacter
                        </a>
                    </div>
                </motion.section>
            </InView>

            <Footer />
        </div>
    );
}
