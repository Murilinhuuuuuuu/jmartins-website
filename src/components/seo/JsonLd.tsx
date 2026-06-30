import { contact, site } from "@/lib/content/site";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: site.description,
    url: site.url,
    foundingDate: String(site.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. São João, 2023",
      addressLocality: "Santa Cecília",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    telephone: contact.phone,
    email: contact.email,
    areaServed: "São Paulo",
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
