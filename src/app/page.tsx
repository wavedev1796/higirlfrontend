import { redirect } from "next/navigation";
import { ROUTES } from "../constants/routes";

export default function HomePage() {
  // Por ahora redirigimos al login ya que es la funcionalidad principal implementada
  redirect(ROUTES.LOGIN);
  
  return null;
}
