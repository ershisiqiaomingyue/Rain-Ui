"use client"

import React, { useId } from "react"
import { cn } from "../../lib/utils"

/* -- Brand Logo ---------------------------------------------------------------
 * Android-Toolkit 的品牌标（「液态水银天青」）：四道渐变环轨 + 水银星核，
 * SVG 原样内联（同 ProviderLogo 的彩标模式）—— 渐变与滤镜是品牌的一部分，
 * 不跟主题、不跟 currentColor。
 *
 * 渐变/滤镜 id 用 useId 加前缀：页面上同时渲染多枚时不会互相串渐变。
 * --------------------------------------------------------------------------- */

export interface BrandLogoProps extends React.SVGProps<SVGSVGElement> {
  /** 数字尺寸（px）。不给时走 className 里的尺寸档（默认 size-6）。 */
  size?: number
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className,
  size,
  style,
  ...props
}) => {
  const uid = useId().replace(/[:]/g, "")
  const g = (name: string) => `${uid}-${name}`
  const dim = size ? { width: size, height: size } : undefined

  return (
    <svg
      viewBox="0 0 512 512"
      role="img"
      aria-label="Android Toolkit"
      className={cn("inline-block size-6 shrink-0", className)}
      style={{ ...dim, ...style }}
      {...props}
    >
      <defs>
        <linearGradient id={g("mercGrad1")} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="40%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        <linearGradient id={g("mercGrad2")} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="60%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>

        <linearGradient id={g("mercGrad3")} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>

        <linearGradient id={g("mercGrad4")} x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#f0f9ff" />
        </linearGradient>

        <linearGradient id={g("mercStarCore")} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        <filter id={g("mercShadow")} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#2563eb" floodOpacity="0.25" />
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#38bdf8" floodOpacity="0.2" />
        </filter>

        <filter id={g("mercGlow")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="20" />
        </filter>
      </defs>

      <circle cx="256" cy="256" r="110" fill="#7dd3fc" opacity="0.14" filter={`url(#${g("mercGlow")})`} />

      <g filter={`url(#${g("mercShadow")})`} transform="translate(256, 256)">
        <ellipse cx="0" cy="0" rx="160" ry="60" fill="none" stroke={`url(#${g("mercGrad1")})`} strokeWidth="18" opacity="0.95" />
        <ellipse cx="0" cy="0" rx="160" ry="60" transform="rotate(45)" fill="none" stroke={`url(#${g("mercGrad2")})`} strokeWidth="18" opacity="0.95" />
        <ellipse cx="0" cy="0" rx="160" ry="60" transform="rotate(90)" fill="none" stroke={`url(#${g("mercGrad3")})`} strokeWidth="18" opacity="0.95" />
        <ellipse cx="0" cy="0" rx="160" ry="60" transform="rotate(135)" fill="none" stroke={`url(#${g("mercGrad4")})`} strokeWidth="18" opacity="0.95" />

        <path d="M -120,-40 C -40,-60 40,-60 120,-40" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.95" />
        <path d="M -40,-120 C -60,-40 -60,40 -40,120" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.95" />

        <path
          d="M 0,-70
             C 8,-35 35,-8 70,0
             C 35,8 8,35 0,70
             C -8,35 -35,8 -70,0
             C -35,-8 -8,-35 0,-70 Z"
          fill={`url(#${g("mercStarCore")})`}
          opacity="0.98"
        />

        <line x1="0" y1="-70" x2="0" y2="70" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.95" />
        <line x1="-70" y1="0" x2="70" y2="0" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.95" />

        <circle cx="0" cy="0" r="5" fill="#ffffff" />
        <circle cx="0" cy="0" r="16" fill="#7dd3fc" opacity="0.45" filter={`url(#${g("mercGlow")})`} />
      </g>
    </svg>
  )
}
