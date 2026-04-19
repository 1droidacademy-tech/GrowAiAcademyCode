'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import UserMenu from './UserMenu';

interface NavbarProps {
  user: any;
}

export default function Navbar({ user }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="relative w-40 md:w-44 h-12 md:h-10 overflow-hidden">
            <Image src="/logo.png" alt="GrowAiEdu Logo" fill className="object-contain" />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <Link href="/ai-course-for-school-students/ai-bootcamp" className="hover:text-indigo-600 transition-colors">Curriculum</Link>
          <Link href="/contact-ai-course" className="hover:text-indigo-600 transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          {/* User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4 md:gap-6">
                <Link 
                  href={user.role === "ADMIN" ? "/admin-dashboard" : "/student-dashboard"}
                  className="hidden md:block text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </Link>
                <UserMenu user={user} />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
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
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden w-10 h-10 flex items-center justify-center text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <span className="text-2xl">✕</span>
              ) : (
                <span className="text-2xl">☰</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 py-6 px-6 flex flex-col gap-6 shadow-xl animate-in slide-in-from-top duration-300">
          <Link 
            href="/" 
            className="text-lg font-bold text-slate-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/ai-course-for-school-students/ai-bootcamp" 
            className="text-lg font-bold text-slate-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Curriculum
          </Link>
          <Link 
            href="/contact-ai-course" 
            className="text-lg font-bold text-slate-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          
          {!user && (
            <div className="flex flex-col gap-4 pt-4 border-t border-slate-50">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full text-left font-bold text-slate-600 py-2">Sign In</button>
              </Link>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full bg-slate-900 text-white rounded-xl py-4 font-bold">Get Started</button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
