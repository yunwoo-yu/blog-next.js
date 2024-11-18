import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 *
 * @param inputs 합칠 클래스들
 * @returns 테일윈드용 merge ClassValue
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
