import AccountClient from "@/src/components/account/AccountClient";
import { withSession } from "@/src/lib/session";
import { getMe } from "@/src/services/auth/api";
import { listCvsApi } from "@/src/services/cv/api";

const AccountPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
    const { locale } = await params;
    const [user, cvs] = await withSession(locale, (token) =>
        Promise.all([getMe(token), listCvsApi(token)])
    );
    return <AccountClient user={user} initialCvs={cvs} />;
};

export default AccountPage;
