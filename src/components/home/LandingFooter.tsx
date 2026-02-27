import Link from "next/link";
import { FileText } from "lucide-react";
import { useState } from "react";

const languages = [
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "de", label: "DE", flag: "🇩🇪" },
];

export function LandingFooter() {
  const [lang, setLang] = useState("fr");
  const [langOpen, setLangOpen] = useState(false);

  return (
    <footer className="border-t border-border bg-background py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-0">
        {/* Brand + disclaimer — takes ~45% */}
        <div className="md:w-[45%] space-y-4 pr-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-[hsl(235,40%,14%)] flex items-center justify-center">
              <FileText className="h-3 w-3 text-white" />
            </div>
            <span className="font-bold text-foreground">CVBuilder</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
            *Les noms et logos des sociétés mentionnées ci-dessus sont des marques déposées appartenant à leurs détenteurs respectifs. Sauf indication contraire, ces références ne visent en aucun cas à suggérer une affiliation ou une association avec CVBuilder.
          </p>
        </div>

        {/* Services */}
        <div className="md:w-[18%] space-y-3">
          <h4 className="font-semibold text-sm text-foreground">Services</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/auth?mode=register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Créer un CV
              </Link>
            </li>
            <li>
              <span className="text-sm text-muted-foreground">Créer une lettre de motivation</span>
            </li>
          </ul>
        </div>

        {/* À propos */}
        <div className="md:w-[22%] space-y-3">
          <h4 className="font-semibold text-sm text-foreground">À propos</h4>
          <ul className="space-y-2">
            {["Nous contacter", "Se désabonner", "Tarifs", "Conditions générales de vente", "Politique de confidentialité", "Mentions légales"].map((item) => (
              <li key={item}>
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Language selector — top-right aligned */}
        <div className="md:w-[15%] flex md:justify-end items-start">
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-sm text-foreground"
            >
              <span>{languages.find((l) => l.code === lang)?.flag}</span>
              <span className="font-medium">{languages.find((l) => l.code === lang)?.label}</span>
              <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute top-full mt-1 right-0 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[120px] z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 ${l.code === lang ? "text-primary font-medium" : "text-foreground"}`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
