import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JMartins Móveis",
    short_name: "JMartins",
    description:
      "Reforma e venda de cadeiras e mobiliário em São Paulo desde 1988.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f3f0",
    theme_color: "#8f1721",
    lang: "pt-BR",
    icons: [
      {
        src: "/brand/logo-symbol.png",
        sizes: "244x166",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
