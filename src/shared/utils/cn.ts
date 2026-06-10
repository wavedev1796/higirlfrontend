/**
 * Shared utility — className merge.
 *
 * Concatenates class names, filtering out falsy values.
 *
 * @example
 * cn("base", isActive && "active", className)
 */

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
