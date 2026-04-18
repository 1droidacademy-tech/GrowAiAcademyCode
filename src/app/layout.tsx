import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import UserMenu from "@/components/UserMenu";

const inter = Inter({
  variable: "--font-family-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrowAiEdu",
  description: "Crafting the next generation of AI Architects.",
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
      <body className="min-h-full flex flex-col font-sans">
        
        {/* Universal Navigation */}
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-40 h-10 overflow-hidden">
                <Image src="/logo.png" alt="GrowAiEdu Logo" fill className="object-contain" />
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <Link href="/course/ai-bootcamp" className="hover:text-indigo-600 transition-colors">Curriculum</Link>
              <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-6">
                  <Link 
                    href={user.role === "ADMIN" ? "/admin-dashboard" : "/student-dashboard"}
                    className="hidden md:block text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <UserMenu user={user} />
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <button className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
