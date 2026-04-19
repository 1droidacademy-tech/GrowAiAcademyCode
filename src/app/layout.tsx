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
    default: "AI Essentials for School Students | Online AI Course India | GrowAiEdu",
    template: "%s | GrowAiEdu"
  },
  description: "Beginner friendly AI course for school students in India. Learn Artificial Intelligence, AI tools, and future skills with GrowAiEdu live online training.",
  keywords: [
    "AI course for school students India",
    "Artificial Intelligence course for kids India",
    "beginner AI course India",
    "online AI course for students India",
    "AI course without coding India",
    "live AI classes for kids India",
    "AI certification for students India",
    "AI training for school students India",
    "learn AI for beginners India",
    "future skills AI course India"
  ],
  authors: [{ name: "GrowAiEdu Team" }],
  creator: "GrowAiEdu",
  publisher: "GrowAiEdu",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://growaiedu.com",
    title: "AI Essentials for School Students | Online AI Course India | GrowAiEdu",
    description: "Beginner friendly AI course for school students in India. Learn Artificial Intelligence, AI tools, and future skills with GrowAiEdu.",
    siteName: "GrowAiEdu",
    images: [{
      url: "/ai-course-students-india.png",
      width: 1200,
      height: 630,
      alt: "AI course for school students learning artificial intelligence online"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowAiEdu | AI Training for School Students India",
    description: "Learn Artificial Intelligence, AI tools, and future skills with GrowAiEdu.",
    images: ["/ai-course-students-india.png"],
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
