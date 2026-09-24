import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Unitainment | Donate & Fuel Future Development",
  description: "Support Unitainment's open, ad-free entertainment tracking platform. Contribute via UPI, Cards, or Net Banking to help keep server infrastructure alive.",
  alternates: {
    canonical: "/donate",
  },
  openGraph: {
    title: "Support Unitainment | Donation & Backer Wall",
    description: "Help fund server hosting, API integrations, and new features for Unitainment.",
    url: "/donate",
  },
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
