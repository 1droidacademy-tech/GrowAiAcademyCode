import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import UserMenu from "@/components/UserMenu";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-family-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GrowAiEdu | Live Online AI Course for School Students",
    template: "%s | GrowAiEdu"
  },
  description: "Learn Artificial Intelligence with our beginner friendly live online AI course for school students. Explore AI tools, projects and future skills with GrowAiEdu.",
  keywords: ["Artificial Intelligence", "AI Course", "School Students", "Live Online Course", "AI Tools", "GrowAiEdu", "AI Projects", "Future Skills"],
  authors: [{ name: "GrowAiEdu Team" }],
  creator: "GrowAiEdu",
  publisher: "GrowAiEdu",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://growaiedu.com",
    title: "GrowAiEdu | Live Online AI Course for School Students",
    description: "Learn Artificial Intelligence with our beginner friendly live online AI course for school students.",
    siteName: "GrowAiEdu",
    images: [{
      url: "/hero_students.png",
      width: 1200,
      height: 630,
      alt: "GrowAiEdu AI Learning Platform"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowAiEdu | Live Online AI Course for School Students",
    description: "Explore AI tools, projects and future skills with GrowAiEdu.",
    images: ["/hero_students.png"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("growaiedu_token")?.value;
  const user = token ? verifyToken(token) : null;

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-slate-900 group/body">
        
        {/* Universal Navigation */}
        <Navbar user={user} />

        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
