import { redirect } from "next/navigation";

/**
 * Página raíz — redirige al catálogo de herramientas (funcionalidad principal del MVP).
 */
export default function HomePage() {
  redirect("/catalogo");
}
