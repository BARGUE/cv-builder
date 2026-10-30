import { redirect } from "next/navigation";
import { AuthPageClient } from "@/src/components/auth/AuthPageClient";

const VALID_MODES = ["login", "register"] as const;
type AuthMode = (typeof VALID_MODES)[number];

export default async function AuthPage({ params }: { params: Promise<{ locale: string; name: string }> }) {
  const { locale, name } = await params;
  if (!VALID_MODES.includes(name as AuthMode)) redirect(`/${locale}/auth/login`);
  return <AuthPageClient mode={name as AuthMode} />;
}
