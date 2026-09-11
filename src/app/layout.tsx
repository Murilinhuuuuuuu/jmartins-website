import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { allowIndexing, contact, seo, site } from "@/lib/content/site";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: seo.title, template: "%s | JMartins Móveis" },
  description: seo.description,
  keywords: seo.keywords,
  metadataBase: new URL(site.url),
  icons: {
    icon: [{ url: "/brand/logo-symbol.png", type: "image/png", sizes: "244x166" }],
    shortcut: "/brand/logo-symbol.png",
    apple: "/brand/logo-symbol.png",
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: seo.title,
    description: seo.description,
    locale: "pt_BR",
    type: "website",
    siteName: site.name,
    images: [
      {
        url: "/media/illustrative/cadeiras-ambiente.webp",
        alt: "Cadeiras da linha JMartins em ambiente ilustrativo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  robots: { index: allowIndexing, follow: allowIndexing },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  other: {
    "contact:phone_number": contact.phone,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${openSans.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body className="font-body antialiased">
        <a href="#conteudo-principal" className="skip-link">
          Ir para o conteúdo
        </a>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
