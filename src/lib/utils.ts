import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 견적서 공유 URL 생성
 * 환경변수 NEXT_PUBLIC_SITE_URL 우선, 없으면 브라우저 origin 사용
 */
export function buildInvoiceShareUrl(slug: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/invoice/${slug}`;
}
