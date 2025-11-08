'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-[#050B16] to-[#0A1628] text-white py-16 px-6 mt-auto border-t border-[#35BFFF]/20">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="text-3xl font-extrabold tracking-tight mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <span style={{ color: '#35BFFF' }}>human</span>
              <span style={{ color: '#fff' }}>ai</span>
              <span style={{ color: '#35BFFF' }}>ra</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              The premium freelance marketplace. Built for professionals.
            </p>
            {/* Security Badges */}
            <div className="flex flex-col gap-3 mt-6">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Secured by</div>
              <div className="flex items-center gap-4 flex-wrap">
                {/* Stripe Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0D1328]/60 rounded-lg border border-[#35BFFF]/20">
                  <svg viewBox="0 0 60 25" className="h-5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z" fill="#fff"/>
                  </svg>
                </div>
                {/* SSL/Security Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D1328]/60 rounded-lg border border-[#35BFFF]/20">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xs text-slate-300 font-medium">SSL Secure</span>
                </div>
              </div>
            </div>
          </div>

          {/* For Clients */}
          <div>
            <h3 className="text-[#35BFFF] font-semibold mb-4 text-base uppercase tracking-wider">For Clients</h3>
            <ul className="space-y-2.5">
              <li><Link href="/browse" className="footer-link">Browse Services</Link></li>
              <li><Link href="/browse" className="footer-link">Find Freelancers</Link></li>
              <li><Link href="/how-it-works" className="footer-link">How it Works</Link></li>
              <li><Link href="/payment-protection" className="footer-link">Payment Protection</Link></li>
              <li><Link href="/help" className="footer-link">Client Support</Link></li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h3 className="text-[#35BFFF] font-semibold mb-4 text-base uppercase tracking-wider">For Freelancers</h3>
            <ul className="space-y-2.5">
              <li><Link href="/become-seller" className="footer-link">Become a Seller</Link></li>
              <li><Link href="/seller/dashboard" className="footer-link">Seller Dashboard</Link></li>
              <li><Link href="/success-stories" className="footer-link">Success Stories</Link></li>
              <li><Link href="/seller-resources" className="footer-link">Seller Resources</Link></li>
              <li><Link href="/community" className="footer-link">Community</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[#35BFFF] font-semibold mb-4 text-base uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="footer-link">About Us</Link></li>
              <li><Link href="/blog" className="footer-link">Blog</Link></li>
              <li><Link href="/contact" className="footer-link">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-[#35BFFF] font-semibold mb-4 text-base uppercase tracking-wider">Legal & Support</h3>
            <ul className="space-y-2.5">
              <li><Link href="/terms" className="footer-link">Terms of Service</Link></li>
              <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="footer-link">Refund Policy</Link></li>
              <li><Link href="/help" className="footer-link">Help Center</Link></li>
              <li><Link href="/security" className="footer-link">Security</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Humanaira. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="https://www.linkedin.com/company/humanaira/" target="_blank" rel="noopener noreferrer" className="hover:text-[#35BFFF] transition">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://www.instagram.com/humanairaglobal" target="_blank" rel="noopener noreferrer" className="hover:text-[#35BFFF] transition">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .footer-link {
          color: #94a3b8;
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.2s ease;
          display: inline-block;
          font-weight: 400;
        }
        .footer-link:hover {
          color: #35BFFF;
        }
      `}</style>
    </footer>
  )
}
