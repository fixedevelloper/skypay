import "./globals.css";
import AppProvidersWrapper from "./components/AppWrapper";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: {
    template: '%s | achat rapide et securisee',
    default: 'Skypay',
  },
  description: 'A fully featured admin theme which can be used to build CRM, CMS, etc.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
 <html lang="en">
      <body>
        <AppProvidersWrapper>{children}</AppProvidersWrapper>
      </body>
    </html>
  );
}
/* export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: any;
}>) {
  return (
    <html lang="fr">
      <body
        className={` antialiased`}
      >
        <SessionProviderWrapper session={session}>
           <SnackbarProvider  maxSnack={3}
                               anchorOrigin={{ vertical: "top", horizontal: "right" }}
                               autoHideDuration={4000}>
          {children}
           <AxiosInterceptorSetup />
          </SnackbarProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
} */
