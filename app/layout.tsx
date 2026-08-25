import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ORCA — Marine Intelligence Platform | SIH 2026",
  description: "Agentic AI-powered marine intelligence for fishermen, coastal authorities, and disaster management. Potential Fishing Zones, real-time alerts, sea safety, and route optimization powered by ISRO satellite data.",
  keywords: "ORCA, marine intelligence, fishing zones, PFZ, INCOIS, sea safety, cyclone alerts, ISRO, Smart India Hackathon",
  openGraph: {
    title: "ORCA — Marine Intelligence Platform",
    description: "AI-powered marine intelligence for India's coast",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
