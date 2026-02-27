import { CVProvider } from "@/src/context/CVContext";
import { Toaster } from "react-hot-toast";
import { getMe } from "@/src/services/auth/api";
import { ApiCvListItem, listCvsApi } from "@/src/services/cv/api";
import { MeResponse } from "@/src/services/auth/types";
import { getToken } from "@/src/lib/auth";
import "./globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialUser: MeResponse | null = null;
  let initialCvs: ApiCvListItem[] | undefined;
  let skipClientAuthRefetch = false;

  const token = await getToken();
  if (token) {
    try {
      initialUser = await getMe(token);
      if (initialUser) {
        initialCvs = await listCvsApi(token);
      } else {
        initialCvs = [];
      }
    } catch {
      initialCvs = [];
    }
  } else {
    skipClientAuthRefetch = true;
    initialCvs = [];
  }

  return (
    <html lang="en">
      <body>
        <CVProvider initialUser={initialUser} initialCvs={initialCvs} skipClientAuthRefetch={skipClientAuthRefetch}>
          {children}
        </CVProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            className:
              "bg-card text-card-foreground border border-border rounded-xl px-4 py-3 shadow-lg",
            success: {
              className:
                "bg-primary text-primary-foreground border border-primary/20 rounded-xl px-4 py-3 shadow-lg",
            },
            error: {
              className:
                "bg-destructive text-destructive-foreground border border-destructive/20 rounded-xl px-4 py-3 shadow-lg",
            },
          }}
        />
      </body>
    </html>
  );
}
