/**
 * Shared — Global user types.
 *
 * `User` is a domain-wide concept used by auth, profile, feed, etc.
 * It lives in shared so no feature "owns" it.
 */

export type UserRole = "user" | "admin";

export interface User {
  id: number | string;
  email: string;
  firstName: string;
  lastName: string;
  rol: UserRole;
  interestsCount?: number;
}
