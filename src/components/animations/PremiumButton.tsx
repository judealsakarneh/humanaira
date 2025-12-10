'use client'

import Link from 'next/link'
import { useState, ReactNode } from 'react'

export function PremiumButton({
  href,
  children,
  variant = 'primary',
  onClick,
}: {
  href?: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  const className = `premium-btn ${variant === 'primary' ? 'premium-btn-primary' : 'premium-btn-secondary'}`
  
  const content = (
    <>
      <span className="premium-btn-content">{children}</span>
      {isHovered && (
        <div className="premium-btn-popup">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <style jsx>{`
        .premium-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 40px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9375rem;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
          cursor: pointer;
          min-width: 240px;
        }
        .premium-btn-primary {
          background: linear-gradient(135deg, #35BFFF 0%, #2fb2ff 100%);
          color: white;
          border: 2px solid #35BFFF;
          box-shadow: 
            0 4px 14px rgba(53,191,255,0.3),
            inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .premium-btn-primary:hover {
          box-shadow: 
            0 6px 24px rgba(53,191,255,0.5),
            inset 0 1px 0 rgba(255,255,255,0.3);
          transform: translateY(-2px);
          border-color: #60a5fa;
        }
        .premium-btn-secondary {
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(10px);
          color: #35BFFF;
          border: 2px solid rgba(53,191,255,0.4);
          box-shadow: 
            0 4px 14px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(53,191,255,0.1);
        }
        .premium-btn-secondary:hover {
          border-color: rgba(53,191,255,0.7);
          background: rgba(15, 23, 42, 1);
          box-shadow: 
            0 6px 24px rgba(53,191,255,0.3),
            inset 0 1px 0 rgba(53,191,255,0.2);
          transform: translateY(-2px);
          color: #60a5fa;
        }
        .premium-btn-content {
          position: relative;
          z-index: 2;
        }
        .premium-btn-popup {
          position: absolute;
          top: -40px;
          right: 50%;
          transform: translateX(50%);
          background: linear-gradient(135deg, #35BFFF, #60a5fa);
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(53,191,255,0.4);
          animation: popup-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 10;
        }
        .premium-btn-popup::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #60a5fa;
        }
        @keyframes popup-bounce {
          0% {
            opacity: 0;
            transform: translateX(50%) translateY(10px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateX(50%) translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {content}
    </button>
  )
}
