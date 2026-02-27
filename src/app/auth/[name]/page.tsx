"use client";

import { useState, useEffect, useCallback, SubmitEvent } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { FileText, ArrowRight, ArrowLeft } from "lucide-react";
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

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
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

        setLoading(true);
        try {
            if (isLogin) {
                await login({ email, password });
            } else {
                await register({ email, password });
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
        <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
            <div className="w-full max-w-sm animate-fade-in">
                <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                </Link>

                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary mb-3">
                        <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-xl font-bold">
                        {isLogin ? "Connexion" : "Créer un compte"}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {isLogin ? "Bon retour parmi nous !" : "Commencez gratuitement"}
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="vous@exemple.com"
                                required
                                className="h-10"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={MIN_PASSWORD_LENGTH}
                                className="h-10"
                                disabled={loading}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={loading}
                        >
                            {loading ? "Chargement…" : isLogin ? "Se connecter" : "Créer mon compte"}
                            <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                    </form>

                    <div className="mt-5 pt-4 border-t border-border text-center">
                        <Link
                            href={isLogin ? "/auth/register" : "/auth/login"}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
                            <span className="text-primary font-medium">{isLogin ? "S'inscrire" : "Se connecter"}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
