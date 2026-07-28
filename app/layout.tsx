import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "CPA StudyPilot",
    template: "%s | CPA StudyPilot"
  },
  description: "Premium study packs and guided practice for the CPA exam."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
