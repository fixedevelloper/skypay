import "./globals.css";
import { Metadata } from "next";
import AppProvidersWrapper from "./providers/AppProvidersWrapper";


export const metadata: Metadata = {
  title: {
    template: '%s | achat rapide et securisee',
    default: 'Skypay',
  },
  description: 'Vente Telephone .',
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{ children: React.ReactNode }>) {
  return (
      <html lang="en">
      <head />
      <body>
      <AppProvidersWrapper>
        {children}
      </AppProvidersWrapper>
      </body>
      </html>
  );
}
