import { contact, site } from "@/lib/content/site";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "FurnitureStore"],
    name: site.name,
    legalName: site.legalName,
    taxID: site.cnpj,
    description: site.description,
    url: site.url,
    logo: `${site.url}/brand/logo-symbol.png`,
    image: `${site.url}/brand/logo-symbol.png`,
    foundingDate: String(site.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. São João, 2023",
      addressLocality: "Santa Cecília",
      addressRegion: "SP",
      postalCode: "01211-100",
      addressCountry: "BR",
    },
    telephone: contact.phone,
    areaServed: "São Paulo",
    sameAs: ["https://www.instagram.com/jmartins.expressao/"],
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:00", closes: "18:00" },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
