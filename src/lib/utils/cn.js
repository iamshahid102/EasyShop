/**
 * Utility to merge Tailwind CSS class names
 * Handles falsy values, trims whitespace, and removes duplicate spaces
 * @param {...(string|boolean|null|undefined)} classes - Class names to merge
 * @returns {string} - Cleaned, merged class string
 */
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export default cn;
