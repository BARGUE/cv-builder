import AccountClient from "@/src/components/account/AccountClient";
import { getToken } from "@/src/lib/auth";
import { getMe, isSessionExpiredError } from "@/src/services/auth/api";
import { listCvsApi } from "@/src/services/cv/api";
import { redirect } from "next/navigation";

const AccountPage = async () => {
    const token = await getToken();
    if (!token) {
        redirect("/");
    }
    try {
        const [user, cvs] = await Promise.all([
            getMe(token),
            listCvsApi(token),
        ]);
        return (
            <AccountClient
                user={user}
                initialCvs={cvs}
            />
        );
    } catch (e) {
        if (isSessionExpiredError(e)) {
            redirect("/auth/logout");
        }
        throw e;
    }
};

export default AccountPage;
