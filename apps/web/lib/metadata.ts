import type { Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: "%s | Rewild.bio",
    default: "Rewild.bio - Restore Your Microbiome Naturally",
  },
  description:
    "Expert guidance for restoring gut microbiome diversity through personalized growing. Adaptive protocols for your climate, space, and experience level.",
  keywords: [
    "microbiome restoration",
    "gut health gardening",
    "soil microbiome",
    "regenerative gardening",
    "AI garden coach",
    "microbiome diversity",
    "rewilding",
    "plant-based probiotics",
    "soil to gut",
    "endophytes",
  ],
  openGraph: {
    title: "Rewild.bio - Restore Your Microbiome Naturally",
    description:
      "Expert guidance for restoring gut microbiome diversity through personalized growing. Adaptive protocols for your climate, space, and experience level.",
    url: new URL(defaultUrl),
    siteName: "Rewild.bio",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Rewild.bio - Expert guidance for microbiome restoration",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rewild.bio - Restore Your Microbiome Naturally",
    description:
      "Expert guidance for restoring gut microbiome diversity through personalized growing. Adaptive protocols for your climate, space, and experience level.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const generateLegalMetadata = (
  title: string,
  description: string,
): Metadata => {
  return {
    title: `${title} | Rewild.bio`,
    description,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${title} | Rewild.bio`,
      description,
      type: "website",
    },
  };
};
