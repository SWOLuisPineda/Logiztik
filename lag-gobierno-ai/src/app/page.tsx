import { redirect } from "next/navigation";

/**
 * Root page — redirige al catálogo de herramientas AI.
 *
 * El catálogo es la única vista pública del MVP.
 */
export default function Home() {
  redirect("/catalogo");
}
