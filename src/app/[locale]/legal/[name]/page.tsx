"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import PrivacyClient from "@/src/components/legals/PrivacyClient";
import TermsClient from "@/src/components/legals/TermsClient";

const VALID_PAGES = ["privacy", "terms"] as const;
type LegalPage = (typeof VALID_PAGES)[number];

export default function LegalPage() {
    const router = useRouter();
    const params = useParams();
    const name = (params?.name as string) ?? "";

    useEffect(() => {
        if (VALID_PAGES.includes(name as LegalPage)) return;
        router.replace("/legal/privacy");
    }, [name, router]);

    if (!VALID_PAGES.includes(name as LegalPage)) return null;

    switch (name as LegalPage) {
        case "privacy":
            return <PrivacyClient />;
        case "terms":
            return <TermsClient />;
    }
}
