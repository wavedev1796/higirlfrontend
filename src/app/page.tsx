/**
 * Home page — redirects to login.
 */

import { redirect } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";

export default function HomePage() {
  redirect(ROUTES.LOGIN);
  return null;
}
