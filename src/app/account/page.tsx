import AccountClient from "@/src/components/account/AccountClient";
import { requireAuth } from "@/src/lib/auth";

const AccountPage = async () => {
    await requireAuth();
    return <AccountClient />;
};

export default AccountPage;
