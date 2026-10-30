import { redirect } from "next/navigation";
import PrivacyClient from "@/src/components/legals/PrivacyClient";
import TermsClient from "@/src/components/legals/TermsClient";

export default async function LegalPage({ params }: { params: Promise<{ locale: string; name: string }> }) {
    const { locale, name } = await params;
    switch (name) {
        case "privacy":
            return <PrivacyClient />;
        case "terms":
            return <TermsClient />;
        default:
            redirect(`/${locale}/legal/privacy`);
    }
}
