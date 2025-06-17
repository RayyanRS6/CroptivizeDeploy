import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getWeatherColor(value, type) {
  if (type === "wind") {
    if (value > 15) return "text-destructive"
    if (value > 10) return "text-yellow-500"
    return "text-green-500"
  } else {
    if (value > 60) return "text-destructive"
    if (value > 30) return "text-yellow-500"
    return "text-green-500"
  }
}

export const formatDiseaseName = (diseaseName) => {
  if (!diseaseName) return "Unknown Disease";

  // Replace underscores and double underscores with spaces
  let formatted = diseaseName.replace(/__/g, " ").replace(/_/g, " ");

  // Remove "Cotton" prefix if present as it's redundant in the database
  formatted = formatted.replace(/^Cotton\s+/i, "");

  // Capitalize each word
  formatted = formatted.split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return formatted;
};