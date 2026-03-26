import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { FileText } from "lucide-react";

export function Header() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(235,40%,14%)]/90 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
            <FileText className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">CVBuilder</span>
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10 text-sm" asChild>
            <Link href="/auth/login">Connexion</Link>
          </Button>
          <Button size="sm" className="rounded-xl px-5 text-sm" asChild>
            <Link href="/auth/register">Commencer →</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
