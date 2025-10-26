import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isObejectChanges(obj1, obj2) {
  return (
    Object.keys(obj1).length !== Object.keys(obj2).length ||
    Object.keys(obj1).some((key) => obj1[key] !== obj2[key])
  );
}
