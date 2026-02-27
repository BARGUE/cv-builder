"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { login, register } from "@/src/services/auth/client";
import { useCVContext } from "@/src/context/CVContext";
import toast from "react-hot-toast";

const MIN_PASSWORD_LENGTH = 6;

const VALID_MODES = ["login", "register"] as const;

export default function AuthPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { refetchUser } = useCVContext();

    const name = (params?.name as string) ?? "";
    const isLogin = name === "login";
    const errorFromUrl = searchParams.get("error");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (VALID_MODES.includes(name as "login" | "register")) return;
        router.replace("/auth/login");
    }, [name, router]);

    useEffect(() => {
        if (!errorFromUrl) return;
        const message = (() => {
            try {
                return decodeURIComponent(errorFromUrl);
            } catch {
                return errorFromUrl;
            }
        })();
        toast.error(message);
    }, [errorFromUrl]);

    const showError = useCallback((message: string) => {
        toast.error(message);
    }, []);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const email = (form.email as HTMLInputElement).value.trim();
        const password = (form.password as HTMLInputElement).value;

        if (!email || !password) {
            showError("Email et mot de passe requis");
            return;
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            showError(`Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères`);
            return;
        }

        let firstName = "";
        let lastName = "";
        if (!isLogin) {
            firstName = (form.firstName as HTMLInputElement).value.trim();
            lastName = (form.lastName as HTMLInputElement).value.trim();
            if (!firstName || !lastName) {
                showError("Prénom et nom requis");
                return;
            }
        }

        setLoading(true);
        try {
            if (isLogin) {
                await login({ email, password });
            } else {
                await register({ email, password, firstName, lastName });
            }
            toast.success(isLogin ? "Connexion réussie" : "Inscription réussie");
            await refetchUser();
            router.push("/dashboard");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Une erreur est survenue";
            showError(message);
        } finally {
            setLoading(false);
        }
    }

    if (!VALID_MODES.includes(name as "login" | "register")) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
              {isLogin ? (
                "Connexion"
              ) : (
                <>
                  Créer un compte pour<br />
                  <span className="text-primary">Obtenez votre CV</span>
                </>
              )}
            </h1>
            <p className="text-muted-foreground text-sm mt-3 max-w-sm">
              {isLogin
                ? "Bon retour parmi nous !"
                : "Inscrivez-vous avec votre e-mail pour enregistrer, modifier et télécharger votre CV."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-foreground">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="h-11 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Nom de famille</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="h-11 border-border"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Adresse e-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="h-11 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={MIN_PASSWORD_LENGTH}
                className="h-11 border-border"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold"
              disabled={loading}
            >
              {loading ? "Chargement..." : isLogin ? "Se connecter" : "Obtenez votre CV"}
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Pas encore de compte ? " : "Vous avez déjà un compte ? "}
            <Link
              href={isLogin ? "/auth/register" : "/auth/login"}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? "S'inscrire" : "Connexion"}
            </Link>
          </p>
        </div>
      </div>
    );
}
