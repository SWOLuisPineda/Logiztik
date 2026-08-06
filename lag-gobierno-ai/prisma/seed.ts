import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

/**
 * Datos de las 27 herramientas activas + 4 retiradas del catálogo LAG.
 * Fuente: docs/company/catalogo-herramientas-datos.md
 *
 * Transformaciones:
 * - "Activa (condicional)" → estado "Condicional"
 * - Categoría "—" o vacía → null
 * - Nivel "—" o vacío → null
 * - Retiradas: categoria null, nivelMaximo null, estado "Retirada"
 */

interface SeedHerramienta {
  nombre: string;
  proveedor: string;
  categoria: string | null;
  nivelMaximo: string | null;
  estado: string;
  dpa: string;
  razonRetiro: string | null;
}

const herramientasActivas: SeedHerramienta[] = [
  {
    nombre: "ChatGPT",
    proveedor: "OpenAI",
    categoria: "IA Generativa",
    nivelMaximo: "Interna",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Gemini",
    proveedor: "Google",
    categoria: "IA Generativa",
    nivelMaximo: "Publica",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Microsoft Copilot Chat",
    proveedor: "Microsoft",
    categoria: "IA Generativa",
    nivelMaximo: "Interna",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Claude",
    proveedor: "Anthropic",
    categoria: "IA Generativa",
    nivelMaximo: "Interna",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "GitHub Copilot",
    proveedor: "Microsoft / GitHub",
    categoria: "Desarrollo",
    nivelMaximo: "Confidencial",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Magnific",
    proveedor: "Magnific AI",
    categoria: "Imágenes",
    nivelMaximo: "Interna",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Power Automate / Power Apps",
    proveedor: "Microsoft",
    categoria: "Automatización",
    nivelMaximo: "Confidencial",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Agentes IA Seguridad (Sophos MDR)",
    proveedor: "Sophos",
    categoria: "Seguridad",
    nivelMaximo: "Restringida",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "NotebookLM",
    proveedor: "Google",
    categoria: "Análisis documentos",
    nivelMaximo: "Interna",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "hiRing",
    proveedor: "hiRing",
    categoria: "RRHH / Reclutamiento",
    nivelMaximo: "Confidencial",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Figma (con IA)",
    proveedor: "Figma",
    categoria: "Diseño",
    nivelMaximo: "Interna",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Gamma",
    proveedor: "Gamma App",
    categoria: "Presentaciones",
    nivelMaximo: "Publica",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Perplexity",
    proveedor: "Perplexity AI",
    categoria: "Búsqueda",
    nivelMaximo: "Publica",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Apollo",
    proveedor: "Apollo.io",
    categoria: "Ventas / CRM",
    nivelMaximo: "Confidencial",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Meta AI (WhatsApp)",
    proveedor: "Meta",
    categoria: "Mensajería",
    nivelMaximo: "Publica",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "LM Studio",
    proveedor: "LM Studio",
    categoria: "Modelos locales",
    nivelMaximo: "Restringida",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Hugging Face",
    proveedor: "Hugging Face",
    categoria: "Modelos / Desarrollo",
    nivelMaximo: "Interna",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Visual Studio Code",
    proveedor: "Microsoft",
    categoria: "Desarrollo",
    nivelMaximo: "Confidencial",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Visual Studio Professional",
    proveedor: "Microsoft",
    categoria: "Desarrollo",
    nivelMaximo: "Confidencial",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Notebook Microsoft",
    proveedor: "Microsoft",
    categoria: "Productividad",
    nivelMaximo: "Interna",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Document Intelligence",
    proveedor: "Microsoft / Azure",
    categoria: "Procesamiento documental",
    nivelMaximo: "Confidencial",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "N8N",
    proveedor: "n8n",
    categoria: "Automatización",
    nivelMaximo: "Interna",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Grok",
    proveedor: "xAI",
    categoria: "IA Generativa",
    nivelMaximo: "Publica",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Readme.ai",
    proveedor: "Readme.ai",
    categoria: "Documentación",
    nivelMaximo: "Interna",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Agentes Lenovo",
    proveedor: "Lenovo",
    categoria: "Hardware / Productividad",
    nivelMaximo: "Interna",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  {
    nombre: "Clonadores de voz",
    proveedor: "Varios",
    categoria: "Audio / Voz",
    nivelMaximo: "Restringida",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
  },
  // Odiseo: "Activa (condicional)" → "Condicional", categoría "—" → null, nivel "—" → null
  {
    nombre: "Odiseo",
    proveedor: "En evaluación",
    categoria: null,
    nivelMaximo: null,
    estado: "Condicional",
    dpa: "No aplica",
    razonRetiro: null,
  },
];

const herramientasRetiradas: SeedHerramienta[] = [
  {
    nombre: "Windsurf / Cursor",
    proveedor: "Codeium / Anysphere",
    categoria: null,
    nivelMaximo: null,
    estado: "Retirada",
    dpa: "No aplica",
    razonRetiro: "Sin uso activo registrado",
  },
  {
    nombre: "App Q",
    proveedor: "App Q",
    categoria: null,
    nivelMaximo: null,
    estado: "Retirada",
    dpa: "No aplica",
    razonRetiro: "Descontinuado",
  },
  {
    nombre: "Notion AI",
    proveedor: "Notion",
    categoria: null,
    nivelMaximo: null,
    estado: "Retirada",
    dpa: "No aplica",
    razonRetiro: "Reemplazado por OneNote",
  },
  {
    nombre: "DeepSeek",
    proveedor: "DeepSeek",
    categoria: null,
    nivelMaximo: null,
    estado: "Retirada",
    dpa: "No aplica",
    razonRetiro: "Bloqueado por firewall corporativo",
  },
];

async function main() {
  const todasLasHerramientas = [
    ...herramientasActivas,
    ...herramientasRetiradas,
  ];

  console.log(`Seeding ${todasLasHerramientas.length} herramientas...`);

  for (const h of todasLasHerramientas) {
    await prisma.herramienta.upsert({
      where: {
        nombre_proveedor: {
          nombre: h.nombre,
          proveedor: h.proveedor,
        },
      },
      update: {
        categoria: h.categoria,
        nivelMaximo: h.nivelMaximo,
        estado: h.estado,
        dpa: h.dpa,
        razonRetiro: h.razonRetiro,
      },
      create: {
        nombre: h.nombre,
        proveedor: h.proveedor,
        categoria: h.categoria,
        nivelMaximo: h.nivelMaximo,
        estado: h.estado,
        dpa: h.dpa,
        razonRetiro: h.razonRetiro,
      },
    });
  }

  const count = await prisma.herramienta.count();
  console.log(`Seed completo. Total herramientas en BD: ${count}`);
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
